import dotenv from 'dotenv';

dotenv.config();

function _required(name: string, fallback?: string) {
  const v = process.env[name] || fallback;
  if (!v) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  // Made optional for development - add real values in production
  databaseUrl: process.env.DATABASE_URL || 'mock-db-url',
  redisUrl: process.env.REDIS_URL || 'mock-redis-url',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  paymentKey: process.env.PAYMENT_PROVIDER_KEY || 'mock-payment-key',
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
};
