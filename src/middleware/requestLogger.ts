import { Request, Response, NextFunction } from 'express';
import logger, { buildRequestContext } from '../config/logger.js';

/**
 * Request logging middleware
 * Logs all incoming HTTP requests with relevant details
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Get original end function
  const originalEnd = res.end;
  
  // Override res.end to log after response is sent
  res.end = function(chunk?: unknown, encoding?: BufferEncoding | (() => void), callback?: () => void): Response {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Build log context
    const context = {
      ...buildRequestContext(req as Request & { user?: { _id: string; email: string } }),
      statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length'),
      responseTime: duration
    };
    
    // Log level based on status code
    if (statusCode >= 500) {
      logger.error(`${req.method} ${req.originalUrl} ${statusCode} - ${duration}ms`, context);
    } else if (statusCode >= 400) {
      logger.warn(`${req.method} ${req.originalUrl} ${statusCode} - ${duration}ms`, context);
    } else {
      logger.http(`${req.method} ${req.originalUrl} ${statusCode} - ${duration}ms`, context);
    }
    
    // Call original end function
    // @ts-ignore - Complex overload type handling
    return originalEnd.apply(this, arguments);
  };
  
  next();
};

/**
 * Detailed request logger for debugging
 * Logs request body and headers (use only in development)
 */
export const detailedRequestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Log incoming request
  const requestLog: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent'],
      'accept': req.headers['accept'],
      'origin': req.headers['origin'],
      'referer': req.headers['referer']
    }
  };
  
  // Include body for non-GET requests (exclude sensitive fields)
  if (req.method !== 'GET' && req.body) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields
    delete sanitizedBody.password;
    delete sanitizedBody.confirmPassword;
    delete sanitizedBody.currentPassword;
    delete sanitizedBody.newPassword;
    delete sanitizedBody.cardNumber;
    delete sanitizedBody.cvv;
    delete sanitizedBody.token;
    requestLog.body = sanitizedBody;
  }
  
  // Include query params
  if (Object.keys(req.query).length > 0) {
    requestLog.query = req.query;
  }
  
  logger.debug('Incoming Request', requestLog);
  
  // Log response
  const originalSend = res.send;
  res.send = function(body): Response {
    const duration = Date.now() - startTime;
    
    logger.debug('Outgoing Response', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: body ? Buffer.byteLength(body, 'utf8') : 0
    });
    
    return originalSend.call(this, body);
  };
  
  next();
};

/**
 * Security request logger
 * Logs suspicious or security-relevant requests
 */
export const securityRequestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const suspiciousPatterns = [
    /\.\.\//,                    // Path traversal
    /<script/i,                   // XSS attempt
    /union.*select/i,             // SQL injection
    /\$where|\$regex|\$ne/i,      // NoSQL injection
    /eval\s*\(/i,                 // Code injection
    /javascript:/i,               // JavaScript protocol
    /on\w+\s*=/i                  // Event handlers
  ];
  
  const checkValue = (value: unknown): boolean => {
    if (typeof value === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => checkValue(v));
    }
    return false;
  };
  
  const isSuspicious = 
    checkValue(req.query) ||
    checkValue(req.body) ||
    checkValue(req.params);
  
  if (isSuspicious) {
    logger.warn('[Security] Suspicious request detected', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      query: req.query,
      body: req.method !== 'GET' ? req.body : undefined
    });
  }
  
  next();
};

export default requestLogger;
