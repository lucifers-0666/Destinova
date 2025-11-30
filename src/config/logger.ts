import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log directory
const logDir = path.join(__dirname, '../../logs');

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
);

// Console format (colorized for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, metadata }) => {
    const meta = Object.keys(metadata || {}).length ? ` ${JSON.stringify(metadata)}` : '';
    return `[${timestamp}] ${level}: ${message}${meta}`;
  })
);

// File format (JSON for production)
const fileFormat = winston.format.combine(
  logFormat,
  winston.format.json()
);

// Define custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Tell winston about colors
winston.addColors(colors);

// Determine log level based on environment
const level = (): string => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Create transports array
const transports: winston.transport[] = [];

// Console transport (always enabled in development)
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_CONSOLE_LOGS === 'true') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: level()
    })
  );
}

// File transports (enabled if LOG_TO_FILE is true or in production)
if (process.env.LOG_TO_FILE === 'true' || process.env.NODE_ENV === 'production') {
  // Error logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    })
  );

  // Combined logs (all levels)
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    })
  );

  // HTTP request logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'http.log'),
      level: 'http',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 3,
      tailable: true
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  exceptionHandlers: process.env.LOG_TO_FILE === 'true' || process.env.NODE_ENV === 'production'
    ? [
        new winston.transports.File({
          filename: path.join(logDir, 'exceptions.log'),
          format: fileFormat
        })
      ]
    : [],
  rejectionHandlers: process.env.LOG_TO_FILE === 'true' || process.env.NODE_ENV === 'production'
    ? [
        new winston.transports.File({
          filename: path.join(logDir, 'rejections.log'),
          format: fileFormat
        })
      ]
    : [],
  exitOnError: false
});

// Stream for Morgan HTTP logging integration
export const httpLogStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  }
};

/**
 * Log utility functions
 */
export const logError = (message: string, error?: Error | unknown, context?: Record<string, unknown>): void => {
  const errorInfo = error instanceof Error
    ? { errorMessage: error.message, stack: error.stack }
    : { errorMessage: String(error) };
  
  logger.error(message, { ...errorInfo, ...context });
};

export const logWarning = (message: string, context?: Record<string, unknown>): void => {
  logger.warn(message, context);
};

export const logInfo = (message: string, context?: Record<string, unknown>): void => {
  logger.info(message, context);
};

export const logDebug = (message: string, context?: Record<string, unknown>): void => {
  logger.debug(message, context);
};

export const logHttp = (message: string, context?: Record<string, unknown>): void => {
  logger.http(message, context);
};

/**
 * Request logging context builder
 */
export const buildRequestContext = (req: {
  method: string;
  originalUrl: string;
  ip?: string;
  user?: { _id: string; email: string };
  headers?: Record<string, string | string[] | undefined>;
}): Record<string, unknown> => {
  return {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?._id,
    userEmail: req.user?.email,
    userAgent: req.headers?.['user-agent']
  };
};

/**
 * Performance logging
 */
export const logPerformance = (
  operation: string,
  durationMs: number,
  context?: Record<string, unknown>
): void => {
  const level = durationMs > 5000 ? 'warn' : durationMs > 1000 ? 'info' : 'debug';
  logger.log(level, `[Performance] ${operation} completed in ${durationMs}ms`, context);
};

/**
 * Security event logging
 */
export const logSecurityEvent = (
  event: string,
  context: Record<string, unknown>,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): void => {
  const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
  logger.log(level, `[Security] ${event}`, { severity, ...context });
};

/**
 * Audit logging
 */
export const logAudit = (
  action: string,
  userId: string,
  resource: string,
  details?: Record<string, unknown>
): void => {
  logger.info(`[Audit] ${action}`, {
    userId,
    resource,
    ...details,
    timestamp: new Date().toISOString()
  });
};

export default logger;
