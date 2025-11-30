import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { globalLimiter, apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import logger, { httpLogStream } from './config/logger.js';
import { initSentry, sentryErrorHandler, sentryUserMiddleware } from './config/sentry.js';
import { setupSwagger } from './config/swagger.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import priceAlertRoutes from './routes/priceAlertRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import insuranceRoutes from './routes/insuranceRoutes.js';
import multiCityRoutes from './routes/multiCityRoutes.js';
import checkInRoutes from './routes/checkInRoutes.js';
import refundRoutes from './routes/refundRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

// Services
import pricingService from './services/pricingService.js';

// Jobs
import { startPriceUpdateJob } from './jobs/priceUpdateJob.js';
import { startPriceAlertJob } from './jobs/priceAlertJob.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize Sentry (must be first!)
initSentry(app);

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// ===========================================
// SECURITY MIDDLEWARE
// ===========================================

// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://js.stripe.com'],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      frameSrc: ["'self'", 'https://js.stripe.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Gzip compression for responses
app.use(compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression's default filter
    return compression.filter(req, res);
  }
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Global rate limiter (1000 requests per 15 min)
if (process.env.NODE_ENV === 'production') {
  app.use(globalLimiter);
}

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist: [
    'price', 'duration', 'rating', 'sort', 'page', 'limit',
    'origin', 'destination', 'departureTime', 'arrivalTime'
  ]
}));

// ===========================================
// LOGGING MIDDLEWARE
// ===========================================

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: httpLogStream }));
}

// Custom request logger
app.use(requestLogger);

// Sentry user context middleware
app.use(sentryUserMiddleware);

// Set EJS as the view engine
app.set('view engine', 'ejs');
// backend/src/app.ts -> backend/views
app.set('views', path.join(__dirname, '../views'));

// Serve static files
// We are in src/app.ts
// Root is src/.. -> d:\destinova -v1
const projectRoot = path.join(__dirname, '../');

app.use('/css', express.static(path.join(projectRoot, 'css')));
app.use('/js', express.static(path.join(projectRoot, 'js')));
app.use('/site-images', express.static(path.join(projectRoot, 'site-images')));
app.use('/html', express.static(path.join(projectRoot, 'html')));
app.use('/Admin', express.static(path.join(projectRoot, 'Admin')));
app.use('/react', express.static(path.join(projectRoot, 'react')));
app.use('/manifest.json', express.static(path.join(projectRoot, 'manifest.json')));
app.use('/service-worker.js', express.static(path.join(projectRoot, 'service-worker.js')));

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/flights', apiLimiter, flightRoutes);
app.use('/api/flights', seatRoutes); // Seat selection routes under flights
app.use('/api/hotels', apiLimiter, hotelRoutes);
app.use('/api/bookings', apiLimiter, bookingRoutes);
app.use('/api/payments', apiLimiter, paymentRoutes);
app.use('/api/destinations', apiLimiter, destinationRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/price-alerts', apiLimiter, priceAlertRoutes);
app.use('/api/pricing', apiLimiter, pricingRoutes);
app.use('/api/insurance', apiLimiter, insuranceRoutes);
app.use('/api', multiCityRoutes);
app.use('/api/check-in', apiLimiter, checkInRoutes);
app.use('/api/refunds', apiLimiter, refundRoutes);

// Setup Swagger API Documentation
setupSwagger(app);

// Initialize services and jobs
const initializeServices = async () => {
  try {
    // Load AI pricing model
    await pricingService.loadModel();
    logger.info('[App] Pricing service initialized');

    // Start cron jobs
    startPriceUpdateJob();
    startPriceAlertJob();
    logger.info('[App] Cron jobs started');
  } catch (error) {
    logger.error('[App] Failed to initialize services:', { error: (error as Error).message });
  }
};

// Initialize on app load (non-blocking)
initializeServices();

// View Routes
app.get('/', (_req, res) => {
  res.render('index', {
    title: 'Destinova - Premium Flight Booking',
  });
});

app.get('/booking', (_req, res) => {
  res.render('booking', {
    title: 'Destinova - Booking',
  });
});

app.get('/sign-in', (_req, res) => {
  res.render('sign-in', {
    title: 'Destinova - Sign In',
  });
});

app.get('/sign-up', (_req, res) => {
  res.render('sign-up', {
    title: 'Destinova - Sign Up',
  });
});

// Health check routes (comprehensive)
app.use('/health', healthRoutes);

// ===========================================
// ERROR HANDLING
// ===========================================

// Sentry error handler (must be before other error handlers)
app.use(sentryErrorHandler());

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

// Fallback error handlers (for backwards compatibility)
app.use(notFound);
app.use(errorHandler);

export { app };