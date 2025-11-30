import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../types/api.js';

/**
 * Verify user is an admin
 */
export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  if (!req.user) {
    return errorResponse(res, 401, 'Authentication required');
  }

  if (req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Access denied. Admin privileges required.');
  }

  next();
};

/**
 * Verify user owns the resource or is admin
 */
export const verifyOwnerOrAdmin = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return errorResponse(res, 401, 'Authentication required');
    }

    // Admins can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource (from params or body)
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Access denied. You can only access your own resources.');
    }

    next();
  };
};

/**
 * Verify user owns the resource (strict - no admin override)
 */
export const verifyOwner = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return errorResponse(res, 401, 'Authentication required');
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Access denied. You can only access your own resources.');
    }

    next();
  };
};

/**
 * Verify email is verified
 */
export const verifyEmailVerified = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  if (!req.user) {
    return errorResponse(res, 401, 'Authentication required');
  }

  if (!req.user.isVerified) {
    return errorResponse(res, 403, 'Please verify your email address to access this feature.');
  }

  next();
};

/**
 * Rate limiter for specific user actions
 */
const userActionCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const userId = req.user?._id?.toString() || req.ip || 'anonymous';
    const key = `${userId}:${req.path}`;
    const now = Date.now();

    const record = userActionCounts.get(key);

    if (!record || now > record.resetTime) {
      userActionCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return errorResponse(
        res, 
        429, 
        'Too many requests. Please try again later.',
        `Rate limit exceeded. Try again in ${Math.ceil((record.resetTime - now) / 1000)} seconds.`
      );
    }

    record.count++;
    next();
  };
};
