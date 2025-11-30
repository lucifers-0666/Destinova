import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

/**
 * Custom Application Error Class
 * Base class for all operational errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request - Invalid input
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

/**
 * 400 Validation Error - Input validation failed
 */
export class ValidationError extends AppError {
  public readonly errors: { field: string; message: string }[];

  constructor(errors: { field: string; message: string }[], message: string = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR', errors);
    this.errors = errors;
  }
}

/**
 * 401 Unauthorized - Authentication required or failed
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * 403 Forbidden - Access denied
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * 404 Not Found - Resource not found
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', resource?: string) {
    super(message, 404, 'NOT_FOUND', resource ? { resource } : undefined);
  }
}

/**
 * 409 Conflict - Resource already exists or state conflict
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * 422 Unprocessable Entity - Semantically invalid request
 */
export class UnprocessableEntityError extends AppError {
  constructor(message: string = 'Unprocessable entity', details?: unknown) {
    super(message, 422, 'UNPROCESSABLE_ENTITY', details);
  }
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', retryAfter ? { retryAfter } : undefined);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'INTERNAL_ERROR');
  }
}

/**
 * 502 Bad Gateway - External service failure
 */
export class BadGatewayError extends AppError {
  constructor(message: string = 'External service error') {
    super(message, 502, 'BAD_GATEWAY');
  }
}

/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
  }
}

/**
 * Database Error Handler
 */
const handleDatabaseError = (err: Error & { code?: number | string; keyValue?: Record<string, unknown> }): AppError => {
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    return new ConflictError(`A record with this ${field} already exists`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as unknown as { errors: Record<string, { message: string }> }).errors).map((e) => ({
      field: e.message.split(' ')[0],
      message: e.message
    }));
    return new ValidationError(errors);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return new BadRequestError('Invalid ID format');
  }

  return new InternalServerError('Database operation failed');
};

/**
 * JWT Error Handler
 */
const handleJWTError = (err: Error): AppError => {
  if (err.name === 'JsonWebTokenError') {
    return new UnauthorizedError('Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    return new UnauthorizedError('Your session has expired. Please log in again.');
  }
  return new UnauthorizedError('Authentication failed');
};

/**
 * Development Error Response
 */
const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: {
      code: err.code,
      message: err.message,
      details: err.details,
      stack: err.stack
    },
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
};

/**
 * Production Error Response
 */
const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {})
      }
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('Unexpected error:', {
      error: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      status: 'error',
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again later.'
      }
    });
  }
};

/**
 * Global Error Handler Middleware
 */
export const globalErrorHandler = (
  err: Error & { statusCode?: number; code?: number | string; keyValue?: Record<string, unknown> },
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: AppError;

  // Convert known error types to AppError
  if (err instanceof AppError) {
    error = err;
  } else if (err.name === 'ValidationError' || err.code === 11000 || err.name === 'CastError') {
    error = handleDatabaseError(err);
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJWTError(err);
  } else if (err.name === 'SyntaxError' && 'body' in err) {
    error = new BadRequestError('Invalid JSON in request body');
  } else {
    error = new AppError(err.message || 'An unexpected error occurred', err.statusCode || 500);
    error.stack = err.stack;
  }

  // Log error
  if (error.statusCode >= 500) {
    logger.error(`[${error.statusCode}] ${error.message}`, {
      error: error.message,
      code: error.code,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: (req as Request & { user?: { _id: string } }).user?._id
    });
  } else {
    logger.warn(`[${error.statusCode}] ${error.message}`, {
      code: error.code,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
  }

  // Send appropriate response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new NotFoundError(`Cannot find ${req.method} ${req.originalUrl}`));
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to automatically catch errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default {
  AppError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  TooManyRequestsError,
  InternalServerError,
  BadGatewayError,
  ServiceUnavailableError,
  globalErrorHandler,
  notFoundHandler,
  asyncHandler
};
