import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env';

dotenv.config({ path: path.join(__dirname, '../../', envFile) });

// Also load default .env if exists
dotenv.config({ path: path.join(__dirname, '../../.env') });

// ===========================================
// Environment Type Definitions
// ===========================================

interface DatabaseConfig {
  uri: string;
  options: {
    maxPoolSize: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
    retryWrites: boolean;
  };
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
  cookieExpiresIn: number;
}

interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
}

interface EmailConfig {
  sendgridApiKey: string;
  from: string;
  fromName: string;
  supportEmail: string;
  smtp?: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}

interface RedisConfig {
  url: string;
  tls: boolean;
}

interface AwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  s3Bucket: string;
  region: string;
}

interface MonitoringConfig {
  sentryDsn: string;
  newRelicKey?: string;
  googleAnalyticsId: string;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  authMaxRequests: number;
}

interface AppConfig {
  env: string;
  port: number;
  apiVersion: string;
  frontendUrl: string;
  apiUrl: string;
  allowedOrigins: string[];
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
  database: DatabaseConfig;
  jwt: JwtConfig;
  bcryptSaltRounds: number;
  stripe: StripeConfig;
  email: EmailConfig;
  redis: RedisConfig;
  aws: AwsConfig;
  monitoring: MonitoringConfig;
  rateLimit: RateLimitConfig;
  logLevel: string;
  maintenanceMode: boolean;
}

// ===========================================
// Required Environment Variables
// ===========================================

const requiredEnvVars = [
  'JWT_SECRET',
];

const productionRequiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'SENDGRID_API_KEY',
];

// ===========================================
// Validation Function
// ===========================================

function validateEnvVariables(): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const varsToCheck = isProduction ? productionRequiredEnvVars : requiredEnvVars;
  
  const missing: string[] = [];
  const invalid: string[] = [];
  
  for (const envVar of varsToCheck) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  // Validate JWT_SECRET length in production
  if (isProduction && process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    invalid.push('JWT_SECRET must be at least 32 characters in production');
  }
  
  // Validate MongoDB URI format
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
    invalid.push('MONGODB_URI must be a valid MongoDB connection string');
  }
  
  if (missing.length > 0) {
    console.error('\n❌ FATAL: Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease check your .env file.\n');
    
    if (isProduction) {
      process.exit(1);
    }
  }
  
  if (invalid.length > 0) {
    console.error('\n❌ FATAL: Invalid environment variables:');
    invalid.forEach(v => console.error(`   - ${v}`));
    console.error('\n');
    
    if (isProduction) {
      process.exit(1);
    }
  }
}

// ===========================================
// Helper Functions
// ===========================================

function getEnvString(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

function getEnvArray(key: string, defaultValue: string[] = []): string[] {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

// ===========================================
// Build Configuration Object
// ===========================================

function buildConfig(): AppConfig {
  const env = getEnvString('NODE_ENV', 'development');
  const isProduction = env === 'production';
  const isDevelopment = env === 'development';
  const isTest = env === 'test';
  
  return {
    env,
    port: getEnvNumber('PORT', 4000),
    apiVersion: getEnvString('API_VERSION', 'v1'),
    frontendUrl: getEnvString('FRONTEND_URL', 'http://localhost:4000'),
    apiUrl: getEnvString('API_URL', 'http://localhost:4000'),
    allowedOrigins: getEnvArray('ALLOWED_ORIGINS', ['http://localhost:4000', 'http://localhost:3000']),
    isProduction,
    isDevelopment,
    isTest,
    
    database: {
      uri: getEnvString('MONGODB_URI', getEnvString('DATABASE_URL', 'mongodb://localhost:27017/destinova')),
      options: {
        maxPoolSize: isProduction ? 50 : 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
      },
    },
    
    jwt: {
      secret: getEnvString('JWT_SECRET', 'default_dev_secret_change_in_production'),
      expiresIn: getEnvString('JWT_EXPIRES_IN', '7d'),
      cookieExpiresIn: getEnvNumber('JWT_COOKIE_EXPIRES_IN', 7),
    },
    
    bcryptSaltRounds: getEnvNumber('BCRYPT_SALT_ROUNDS', isProduction ? 12 : 10),
    
    stripe: {
      secretKey: getEnvString('STRIPE_SECRET_KEY', ''),
      publishableKey: getEnvString('STRIPE_PUBLISHABLE_KEY', ''),
      webhookSecret: getEnvString('STRIPE_WEBHOOK_SECRET', ''),
    },
    
    email: {
      sendgridApiKey: getEnvString('SENDGRID_API_KEY', ''),
      from: getEnvString('EMAIL_FROM', 'noreply@destinova.com'),
      fromName: getEnvString('EMAIL_FROM_NAME', 'Destinova'),
      supportEmail: getEnvString('SUPPORT_EMAIL', 'support@destinova.com'),
      smtp: {
        host: getEnvString('SMTP_HOST', ''),
        port: getEnvNumber('SMTP_PORT', 587),
        user: getEnvString('SMTP_USER', ''),
        pass: getEnvString('SMTP_PASS', ''),
      },
    },
    
    redis: {
      url: getEnvString('REDIS_URL', 'redis://localhost:6379'),
      tls: getEnvBoolean('REDIS_TLS', isProduction),
    },
    
    aws: {
      accessKeyId: getEnvString('AWS_ACCESS_KEY_ID', ''),
      secretAccessKey: getEnvString('AWS_SECRET_ACCESS_KEY', ''),
      s3Bucket: getEnvString('AWS_S3_BUCKET', 'destinova-uploads'),
      region: getEnvString('AWS_REGION', 'ap-south-1'),
    },
    
    monitoring: {
      sentryDsn: getEnvString('SENTRY_DSN', ''),
      newRelicKey: getEnvString('NEW_RELIC_LICENSE_KEY'),
      googleAnalyticsId: getEnvString('GOOGLE_ANALYTICS_ID', ''),
    },
    
    rateLimit: {
      windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
      maxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
      authMaxRequests: getEnvNumber('AUTH_RATE_LIMIT_MAX', 5),
    },
    
    logLevel: getEnvString('LOG_LEVEL', isProduction ? 'info' : 'debug'),
    maintenanceMode: getEnvBoolean('MAINTENANCE_MODE', false),
  };
}

// ===========================================
// Validate and Export
// ===========================================

validateEnvVariables();

export const config = buildConfig();

// Log configuration summary in development
if (config.isDevelopment) {
  console.log('\n📋 Configuration loaded:');
  console.log(`   Environment: ${config.env}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database.uri.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')}`);
  console.log(`   Redis: ${config.redis.url ? 'Configured' : 'Not configured'}`);
  console.log(`   Stripe: ${config.stripe.secretKey ? 'Configured' : 'Not configured'}`);
  console.log(`   Email: ${config.email.sendgridApiKey ? 'Configured' : 'Not configured'}`);
  console.log('');
}

export default config;

// Export individual configs for convenience
export const {
  env,
  port,
  isProduction,
  isDevelopment,
  isTest,
  database,
  jwt,
  stripe,
  email,
  redis,
  aws,
  monitoring,
  rateLimit,
} = config;
