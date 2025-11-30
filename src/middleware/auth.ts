import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { errorResponse, TokenPayload } from '../types/api.js';
import { isTokenBlacklisted } from '../controllers/authController.js';

const JWT_SECRET = process.env.JWT_SECRET || 'destinova-secret-key';

/**
 * Verify JWT token and attach user to request
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      return errorResponse(res, 401, 'Token has been invalidated. Please login again.');
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return errorResponse(res, 401, 'User not found. Token is invalid.');
    }

    if (user.isDeleted) {
      return errorResponse(res, 403, 'Account has been deactivated.');
    }

    // Attach user to request
    req.user = user as any;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(res, 401, 'Token has expired. Please login again.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return errorResponse(res, 401, 'Invalid token. Please login again.');
    }
    return errorResponse(res, 500, 'Authentication error');
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (!isTokenBlacklisted(token)) {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && !user.isDeleted) {
          req.user = user as any;
          req.userId = decoded.userId;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Alias exports for compatibility
export const authenticate = verifyToken;
export const protect = verifyToken;
