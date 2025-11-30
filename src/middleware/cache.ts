import { Request, Response, NextFunction } from 'express';
import { cache, isRedisConnected, cacheKeys } from '../config/redis.js';
import logger from '../config/logger.js';

/**
 * Cache Middleware
 * Caches GET request responses with configurable TTL
 */

/**
 * Generate cache key from request
 */
const generateCacheKey = (req: Request, prefix?: string): string => {
  const baseKey = prefix || 'api';
  const path = req.originalUrl || req.url;
  return `${baseKey}:${path}`;
};

/**
 * Cache middleware factory
 * @param duration - Cache duration in seconds
 * @param keyPrefix - Optional prefix for cache key
 */
export const cacheMiddleware = (duration: number = 300, keyPrefix?: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching if Redis is not connected
    if (!isRedisConnected()) {
      return next();
    }

    // Skip caching for authenticated user-specific data
    if (req.headers.authorization && !keyPrefix?.includes('public')) {
      return next();
    }

    const cacheKey = generateCacheKey(req, keyPrefix);

    try {
      // Check cache
      const cachedData = await cache.get<{ body: unknown; headers?: Record<string, string> }>(cacheKey);
      
      if (cachedData) {
        logger.debug(`[Cache] HIT: ${cacheKey}`);
        
        // Set cache headers
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-Key', cacheKey);
        
        // Set any cached headers
        if (cachedData.headers) {
          Object.entries(cachedData.headers).forEach(([key, value]) => {
            res.set(key, value);
          });
        }
        
        res.json(cachedData.body);
        return;
      }

      logger.debug(`[Cache] MISS: ${cacheKey}`);

      // Store original json function
      const originalJson = res.json.bind(res);

      // Override json to cache the response
      res.json = function(body: unknown): Response {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const dataToCache = {
            body,
            headers: {
              'Content-Type': res.get('Content-Type') || 'application/json'
            }
          };
          
          cache.set(cacheKey, dataToCache, duration).catch(err => {
            logger.error('[Cache] Failed to set cache:', { key: cacheKey, error: err.message });
          });
        }

        // Set cache headers
        res.set('X-Cache', 'MISS');
        res.set('X-Cache-Key', cacheKey);
        res.set('Cache-Control', `public, max-age=${duration}`);

        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('[Cache] Middleware error:', { error: (error as Error).message });
      next();
    }
  };
};

/**
 * Clear cache for specific patterns
 */
export const clearCache = async (pattern: string): Promise<boolean> => {
  try {
    await cache.delPattern(pattern);
    logger.info(`[Cache] Cleared pattern: ${pattern}`);
    return true;
  } catch (error) {
    logger.error('[Cache] Clear error:', { pattern, error: (error as Error).message });
    return false;
  }
};

/**
 * Invalidate specific cache keys
 */
export const invalidateCache = async (keys: string | string[]): Promise<boolean> => {
  try {
    await cache.del(keys);
    logger.info(`[Cache] Invalidated keys:`, { keys });
    return true;
  } catch (error) {
    logger.error('[Cache] Invalidate error:', { keys, error: (error as Error).message });
    return false;
  }
};

/**
 * Pre-configured cache middleware for common routes
 */
export const cacheConfig = {
  // Short cache (1 minute) - for frequently changing data
  short: cacheMiddleware(60, 'short'),
  
  // Medium cache (5 minutes) - for search results
  medium: cacheMiddleware(300, 'medium'),
  
  // Long cache (1 hour) - for static data
  long: cacheMiddleware(3600, 'long'),
  
  // Flight search cache (5 minutes)
  flightSearch: cacheMiddleware(300, 'flight:search'),
  
  // Destinations cache (1 hour)
  destinations: cacheMiddleware(3600, 'destinations'),
  
  // Popular destinations cache (30 minutes)
  popularDestinations: cacheMiddleware(1800, 'destinations:popular'),
  
  // Insurance plans cache (1 hour)
  insurancePlans: cacheMiddleware(3600, 'insurance:plans'),
  
  // Analytics cache (10 minutes)
  analytics: cacheMiddleware(600, 'analytics'),
  
  // Public data cache (1 hour)
  publicData: cacheMiddleware(3600, 'public')
};

/**
 * Cache invalidation helpers
 */
export const invalidators = {
  // Invalidate all flight-related caches
  flights: async (): Promise<void> => {
    await clearCache('flight:*');
    await clearCache('short:*/api/flights*');
    await clearCache('medium:*/api/flights*');
  },

  // Invalidate destination caches
  destinations: async (): Promise<void> => {
    await clearCache('destinations:*');
    await clearCache('long:*/api/destinations*');
  },

  // Invalidate user-specific caches
  user: async (userId: string): Promise<void> => {
    await clearCache(`user:${userId}:*`);
    await invalidateCache(cacheKeys.user(userId));
  },

  // Invalidate booking caches
  booking: async (bookingId: string, userId?: string): Promise<void> => {
    await invalidateCache(cacheKeys.booking(bookingId));
    if (userId) {
      await invalidateCache(cacheKeys.userBookings(userId));
    }
  },

  // Invalidate insurance caches
  insurance: async (): Promise<void> => {
    await clearCache('insurance:*');
  },

  // Invalidate all caches
  all: async (): Promise<void> => {
    await cache.flush();
    logger.warn('[Cache] All caches invalidated');
  }
};

export default {
  cacheMiddleware,
  clearCache,
  invalidateCache,
  cacheConfig,
  invalidators
};
