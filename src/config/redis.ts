import { createClient, RedisClientType } from 'redis';
import logger from './logger.js';

/**
 * Redis Configuration
 * Handles connection, caching operations, and error handling
 */

let redisClient: RedisClientType | null = null;
let isConnected = false;

/**
 * Initialize Redis connection
 */
export const connectRedis = async (): Promise<RedisClientType | null> => {
  // Skip Redis in test environment or if disabled
  if (process.env.NODE_ENV === 'test' || process.env.DISABLE_REDIS === 'true') {
    logger.info('[Redis] Redis disabled or in test environment');
    return null;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            logger.error('[Redis] Max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          const delay = Math.min(retries * 100, 3000);
          logger.info(`[Redis] Reconnecting in ${delay}ms (attempt ${retries})`);
          return delay;
        },
        connectTimeout: 5000
      }
    });

    redisClient.on('error', (err) => {
      logger.error('[Redis] Client error:', { error: err.message });
      isConnected = false;
    });

    redisClient.on('connect', () => {
      logger.info('[Redis] Connecting...');
    });

    redisClient.on('ready', () => {
      logger.info('[Redis] Connected and ready');
      isConnected = true;
    });

    redisClient.on('reconnecting', () => {
      logger.info('[Redis] Reconnecting...');
      isConnected = false;
    });

    redisClient.on('end', () => {
      logger.info('[Redis] Connection closed');
      isConnected = false;
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('[Redis] Failed to connect:', { error: (error as Error).message });
    redisClient = null;
    return null;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

/**
 * Check if Redis is connected
 */
export const isRedisConnected = (): boolean => {
  return isConnected && redisClient !== null;
};

/**
 * Disconnect Redis
 */
export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
      redisClient = null;
      isConnected = false;
      logger.info('[Redis] Disconnected');
    } catch (error) {
      logger.error('[Redis] Error during disconnect:', { error: (error as Error).message });
    }
  }
};

/**
 * Cache Operations
 */
export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!isRedisConnected()) return null;
    
    try {
      const value = await redisClient!.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      logger.error('[Redis] Get error:', { key, error: (error as Error).message });
      return null;
    }
  },

  /**
   * Set value in cache with TTL
   */
  async set(key: string, value: unknown, ttlSeconds: number = 300): Promise<boolean> {
    if (!isRedisConnected()) return false;
    
    try {
      await redisClient!.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('[Redis] Set error:', { key, error: (error as Error).message });
      return false;
    }
  },

  /**
   * Delete value from cache
   */
  async del(key: string | string[]): Promise<boolean> {
    if (!isRedisConnected()) return false;
    
    try {
      const keys = Array.isArray(key) ? key : [key];
      await redisClient!.del(keys);
      return true;
    } catch (error) {
      logger.error('[Redis] Delete error:', { key, error: (error as Error).message });
      return false;
    }
  },

  /**
   * Delete keys matching pattern
   */
  async delPattern(pattern: string): Promise<boolean> {
    if (!isRedisConnected()) return false;
    
    try {
      const keys = await redisClient!.keys(pattern);
      if (keys.length > 0) {
        await redisClient!.del(keys);
      }
      return true;
    } catch (error) {
      logger.error('[Redis] Delete pattern error:', { pattern, error: (error as Error).message });
      return false;
    }
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!isRedisConnected()) return false;
    
    try {
      const result = await redisClient!.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('[Redis] Exists error:', { key, error: (error as Error).message });
      return false;
    }
  },

  /**
   * Get TTL of key
   */
  async ttl(key: string): Promise<number> {
    if (!isRedisConnected()) return -2;
    
    try {
      return await redisClient!.ttl(key);
    } catch (error) {
      logger.error('[Redis] TTL error:', { key, error: (error as Error).message });
      return -2;
    }
  },

  /**
   * Increment value
   */
  async incr(key: string): Promise<number | null> {
    if (!isRedisConnected()) return null;
    
    try {
      return await redisClient!.incr(key);
    } catch (error) {
      logger.error('[Redis] Incr error:', { key, error: (error as Error).message });
      return null;
    }
  },

  /**
   * Clear all cache (use with caution!)
   */
  async flush(): Promise<boolean> {
    if (!isRedisConnected()) return false;
    
    try {
      await redisClient!.flushDb();
      logger.warn('[Redis] Cache flushed');
      return true;
    } catch (error) {
      logger.error('[Redis] Flush error:', { error: (error as Error).message });
      return false;
    }
  }
};

/**
 * Cache key generators
 */
export const cacheKeys = {
  flight: (id: string) => `flight:${id}`,
  flightSearch: (params: Record<string, unknown>) => `flight:search:${JSON.stringify(params)}`,
  flightList: (page: number, limit: number) => `flights:list:${page}:${limit}`,
  
  destination: (id: string) => `destination:${id}`,
  destinationsList: () => 'destinations:list',
  popularDestinations: () => 'destinations:popular',
  
  user: (id: string) => `user:${id}`,
  userBookings: (userId: string) => `user:${userId}:bookings`,
  
  booking: (id: string) => `booking:${id}`,
  bookingReference: (ref: string) => `booking:ref:${ref}`,
  
  pricing: (flightId: string, params: Record<string, unknown>) => 
    `pricing:${flightId}:${JSON.stringify(params)}`,
  
  insurance: (id: string) => `insurance:${id}`,
  insurancePlans: () => 'insurance:plans',
  
  analytics: (type: string, period: string) => `analytics:${type}:${period}`,
  
  session: (sessionId: string) => `session:${sessionId}`,
  rateLimit: (ip: string, endpoint: string) => `ratelimit:${ip}:${endpoint}`
};

export default {
  connectRedis,
  getRedisClient,
  isRedisConnected,
  disconnectRedis,
  cache,
  cacheKeys
};
