import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate Limiter Configuration
 * Provides different rate limiting strategies for various route types
 */

// Standard error response for rate limiting
const rateLimitResponse = (message: string) => ({
  success: false,
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message,
    retryAfter: 'Please try again later'
  }
});

/**
 * Auth Routes Rate Limiter
 * Strict limits for authentication endpoints to prevent brute force attacks
 * 5 requests per 15 minutes per IP
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: rateLimitResponse('Too many authentication attempts. Please try again after 15 minutes.'),
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  keyGenerator: (req: Request): string => {
    // Use IP + endpoint for more granular limiting
    return `auth:${req.ip}:${req.path}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many authentication attempts. Please try again after 15 minutes.'));
  }
});

/**
 * Registration Rate Limiter
 * Even stricter for registration to prevent spam accounts
 * 3 requests per hour per IP
 */
export const registrationLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour
  message: rateLimitResponse('Too many registration attempts. Please try again after 1 hour.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `register:${req.ip}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many registration attempts. Please try again after 1 hour.'));
  }
});

/**
 * Login Rate Limiter
 * Moderate limits to prevent brute force while allowing legitimate retries
 * 10 requests per 15 minutes per IP
 */
export const loginLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per window
  message: rateLimitResponse('Too many login attempts. Please try again after 15 minutes.'),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  keyGenerator: (req: Request): string => {
    // Use both IP and email for more targeted limiting
    const email = req.body?.email?.toLowerCase() || 'unknown';
    return `login:${req.ip}:${email}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many login attempts. Please try again after 15 minutes.'));
  }
});

/**
 * API Routes Rate Limiter
 * Standard limits for general API endpoints
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: rateLimitResponse('Too many requests. Please slow down.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `api:${req.ip}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many requests. Please slow down.'));
  }
});

/**
 * Search Routes Rate Limiter
 * Moderate limits for search endpoints which can be resource-intensive
 * 50 requests per 15 minutes per IP
 */
export const searchLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 search requests per window
  message: rateLimitResponse('Too many search requests. Please wait before searching again.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `search:${req.ip}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many search requests. Please wait before searching again.'));
  }
});

/**
 * Booking Routes Rate Limiter
 * Limits for booking creation to prevent abuse
 * 20 requests per 15 minutes per IP
 */
export const bookingLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 booking requests per window
  message: rateLimitResponse('Too many booking requests. Please try again later.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `booking:${req.ip}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many booking requests. Please try again later.'));
  }
});

/**
 * Password Reset Rate Limiter
 * Strict limits to prevent email spam and enumeration attacks
 * 3 requests per hour per IP
 */
export const passwordResetLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 reset requests per hour
  message: rateLimitResponse('Too many password reset requests. Please try again after 1 hour.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `reset:${req.ip}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many password reset requests. Please try again after 1 hour.'));
  }
});

/**
 * Payment Routes Rate Limiter
 * Moderate limits for payment endpoints
 * 30 requests per 15 minutes per IP
 */
export const paymentLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 payment requests per window
  message: rateLimitResponse('Too many payment requests. Please try again later.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `payment:${req.ip}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many payment requests. Please try again later.'));
  }
});

/**
 * Admin Routes Rate Limiter
 * Higher limits for admin endpoints (assumed authenticated)
 * 200 requests per 15 minutes per IP
 */
export const adminLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  message: rateLimitResponse('Too many admin requests. Please slow down.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `admin:${req.ip}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many admin requests. Please slow down.'));
  }
});

/**
 * Global Rate Limiter
 * Applied to all routes as a catch-all
 * 1000 requests per 15 minutes per IP
 */
export const globalLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: rateLimitResponse('Too many requests from this IP. Please try again later.'),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request): boolean => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  },
  keyGenerator: (req: Request): string => {
    return `global:${req.ip}`;
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json(rateLimitResponse('Too many requests from this IP. Please try again later.'));
  }
});

/**
 * Create custom rate limiter with specific configuration
 */
export const createCustomLimiter = (
  windowMs: number,
  maxRequests: number,
  message: string,
  keyPrefix: string = 'custom'
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: rateLimitResponse(message),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request): string => {
      return `${keyPrefix}:${req.ip}`;
    },
    handler: (_req: Request, res: Response) => {
      res.status(429).json(rateLimitResponse(message));
    }
  });
};

export default {
  authLimiter,
  registrationLimiter,
  loginLimiter,
  apiLimiter,
  searchLimiter,
  bookingLimiter,
  passwordResetLimiter,
  paymentLimiter,
  adminLimiter,
  globalLimiter,
  createCustomLimiter
};
