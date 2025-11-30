import * as Sentry from '@sentry/node';
import type { Express, Request, Response, NextFunction } from 'express';
import { config } from './config.js';

/**
 * Initialize Sentry error tracking
 * Only initialized in production with valid DSN
 */
export function initSentry(app: Express): void {
  if (!config.monitoring.sentryDsn) {
    if (config.isProduction) {
      console.warn('⚠️  Sentry DSN not configured. Error tracking is disabled.');
    }
    return;
  }

  Sentry.init({
    dsn: config.monitoring.sentryDsn,
    environment: config.env,
    release: `destinova@${process.env.npm_package_version || '1.0.0'}`,
    
    // Performance monitoring
    tracesSampleRate: config.isProduction ? 0.1 : 1.0, // 10% in prod, 100% in dev
    
    // Profile sampling
    profilesSampleRate: config.isProduction ? 0.1 : 1.0,
    
    // Integrations
    integrations: [
      // HTTP integration for tracing
      Sentry.httpIntegration(),
      // Express integration
      Sentry.expressIntegration(),
      // MongoDB integration
      Sentry.mongoIntegration(),
    ],
    
    // Filter sensitive data
    beforeSend(event) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      
      // Remove sensitive body data
      if (event.request?.data) {
        const data = typeof event.request.data === 'string' 
          ? JSON.parse(event.request.data) 
          : event.request.data;
        
        if (data.password) data.password = '[REDACTED]';
        if (data.cardNumber) data.cardNumber = '[REDACTED]';
        if (data.cvv) data.cvv = '[REDACTED]';
        
        event.request.data = typeof event.request.data === 'string' 
          ? JSON.stringify(data) 
          : data;
      }
      
      return event;
    },
    
    // Ignore certain errors
    ignoreErrors: [
      'ResizeObserver loop',
      'Non-Error promise rejection',
      /^Network request failed$/,
    ],
  });

  // Setup Express error handler with Sentry
  Sentry.setupExpressErrorHandler(app);

  console.log('✅ Sentry error tracking initialized');
}

/**
 * Sentry error handler middleware
 * Must be added after all routes but before other error handlers
 */
export function sentryErrorHandler() {
  return (err: Error, _req: Request, _res: Response, next: NextFunction): void => {
    Sentry.captureException(err);
    next(err);
  };
}

/**
 * Capture exception manually
 */
export function captureException(error: Error, context?: Record<string, unknown>): string {
  return Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture message manually
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): string {
  return Sentry.captureMessage(message, level);
}

/**
 * Set user context for tracking
 */
export function setUser(user: { id: string; email?: string; username?: string } | null): void {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Middleware to set user context from request
 */
export function sentryUserMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const user = (req as Request & { user?: { _id: string; email: string } }).user;
  
  if (user) {
    Sentry.setUser({
      id: user._id.toString(),
      email: user.email,
    });
  }
  
  next();
}

export default {
  initSentry,
  sentryErrorHandler,
  captureException,
  captureMessage,
  setUser,
  addBreadcrumb,
  sentryUserMiddleware,
};
