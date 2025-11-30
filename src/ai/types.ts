/**
 * AI Dynamic Pricing Types
 * Type definitions for the TensorFlow.js pricing model
 */

// Pricing factors calculated for each flight search
export interface PricingFactors {
  // Days between search date and departure
  daysUntilDeparture: number;
  // Normalized: 0-1 (1 = departing today, 0 = 90+ days)
  daysUntilDepartureNormalized: number;
  
  // Seat availability percentage (0-1)
  seatAvailability: number;
  
  // Day of week (0-6, Monday to Sunday)
  dayOfWeek: number;
  // Normalized: 0-1
  dayOfWeekNormalized: number;
  
  // Is weekend (Friday evening - Sunday)
  isWeekend: boolean;
  isWeekendNormalized: number;
  
  // Is Indian holiday
  isHoliday: boolean;
  isHolidayNormalized: number;
  
  // Time of day category
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  timeOfDayNormalized: number;
  
  // Seasonal index (0-1, peak = 1, off-season = 0)
  seasonalityIndex: number;
  
  // Route popularity based on historical bookings (0-1)
  routePopularity: number;
  
  // Recent demand score for this route (0-1)
  demandScore: number;
}

// Input features for the ML model (all normalized 0-1)
export interface ModelFeatures {
  daysUntilDeparture: number;
  seatAvailability: number;
  dayOfWeek: number;
  isWeekend: number;
  isHoliday: number;
  timeOfDay: number;
  seasonalityIndex: number;
  routePopularity: number;
  demandScore: number;
}

// Training data sample
export interface TrainingDataSample {
  // Input features
  features: ModelFeatures;
  
  // Target value
  priceMultiplier: number;
  
  // Metadata (not used in training)
  metadata?: {
    flightId?: string;
    flightNumber?: string;
    route?: string;
    basePrice?: number;
    finalPrice?: number;
    searchDate?: Date;
    departureDate?: Date;
  };
}

// Complete training dataset
export interface TrainingData {
  samples: TrainingDataSample[];
  generatedAt: Date;
  sampleCount: number;
  featureNames: string[];
}

// Prediction result from the AI model
export interface PredictionResult {
  // Original base price
  basePrice: number;
  
  // AI predicted price
  predictedPrice: number;
  
  // Price multiplier (predictedPrice / basePrice)
  priceMultiplier: number;
  
  // Discount amount (positive if cheaper, negative if more expensive)
  discount: number;
  
  // Discount percentage
  discountPercentage: number;
  
  // Confidence score (0-1)
  confidence: number;
  
  // The factors used for prediction
  factors: PricingFactors;
  
  // Price trend indicator
  trend: 'rising' | 'falling' | 'stable';
  
  // Explanation for the price
  explanation: string;
}

// Price history entry
export interface PriceHistoryEntry {
  price: number;
  timestamp: Date;
  predictedBy: 'ai' | 'manual' | 'rule';
  factors?: Partial<PricingFactors>;
  reason?: string;
}

// Model training configuration
export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  validationSplit: number;
  learningRate: number;
  shuffle: boolean;
  verbose: number;
}

// Model evaluation metrics
export interface ModelMetrics {
  loss: number;
  mae: number; // Mean Absolute Error
  mse: number; // Mean Squared Error
  rmse: number; // Root Mean Squared Error
  r2Score: number; // R-squared score
  validationLoss: number;
  validationMae: number;
}

// Indian holiday definition
export interface IndianHoliday {
  name: string;
  date: Date;
  type: 'national' | 'regional' | 'religious' | 'cultural';
  impactMultiplier: number; // How much it affects pricing
}

// Route demand data
export interface RouteDemand {
  origin: string;
  destination: string;
  searchCount: number;
  bookingCount: number;
  averagePrice: number;
  lastUpdated: Date;
}

// Pricing service response
export interface PricingResponse {
  success: boolean;
  prediction: PredictionResult;
  cachedAt?: Date;
  expiresAt?: Date;
}

// Batch pricing update result
export interface BatchPricingResult {
  totalFlights: number;
  updated: number;
  failed: number;
  skipped: number;
  duration: number; // milliseconds
  errors: Array<{
    flightId: string;
    error: string;
  }>;
}
