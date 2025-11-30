/**
 * Training Data Generator
 * Generates synthetic historical pricing data for ML model training
 */

import { TrainingData, TrainingDataSample, ModelFeatures } from './types.js';
import { 
  isIndianHoliday,
  getSeasonality 
} from './pricingFactors.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample routes for synthetic data
const SAMPLE_ROUTES = [
  { origin: 'DEL', destination: 'BOM', basePrice: 5500 },
  { origin: 'DEL', destination: 'BLR', basePrice: 6200 },
  { origin: 'DEL', destination: 'MAA', basePrice: 7500 },
  { origin: 'DEL', destination: 'CCU', basePrice: 6800 },
  { origin: 'DEL', destination: 'HYD', basePrice: 5800 },
  { origin: 'BOM', destination: 'DEL', basePrice: 5500 },
  { origin: 'BOM', destination: 'BLR', basePrice: 4200 },
  { origin: 'BOM', destination: 'CCU', basePrice: 8200 },
  { origin: 'BOM', destination: 'GOI', basePrice: 3800 },
  { origin: 'BLR', destination: 'DEL', basePrice: 6200 },
  { origin: 'BLR', destination: 'BOM', basePrice: 4200 },
  { origin: 'BLR', destination: 'HYD', basePrice: 3200 },
  { origin: 'MAA', destination: 'DEL', basePrice: 7500 },
  { origin: 'MAA', destination: 'BOM', basePrice: 5800 },
  { origin: 'HYD', destination: 'DEL', basePrice: 5800 },
  { origin: 'HYD', destination: 'BLR', basePrice: 3200 },
  { origin: 'CCU', destination: 'DEL', basePrice: 6800 },
  { origin: 'CCU', destination: 'BOM', basePrice: 8200 },
  { origin: 'GOI', destination: 'DEL', basePrice: 6500 },
  { origin: 'GOI', destination: 'BOM', basePrice: 3800 },
];

// Airlines with quality factors
const AIRLINES = [
  { code: 'AI', name: 'Air India', qualityFactor: 1.0 },
  { code: '6E', name: 'IndiGo', qualityFactor: 0.95 },
  { code: 'UK', name: 'Vistara', qualityFactor: 1.1 },
  { code: 'SG', name: 'SpiceJet', qualityFactor: 0.85 },
  { code: 'G8', name: 'GoAir', qualityFactor: 0.88 },
  { code: 'I5', name: 'AirAsia India', qualityFactor: 0.82 },
];

/**
 * Generate random date within a range
 */
function randomDate(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  return new Date(startTime + Math.random() * (endTime - startTime));
}

/**
 * Generate random number within range
 */
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Add noise to a value (for realistic variation)
 */
function addNoise(value: number, noisePercent: number = 0.05): number {
  const noise = value * noisePercent * (Math.random() * 2 - 1);
  return value + noise;
}

/**
 * Calculate realistic final price based on rule-based logic
 */
function calculateRealisticPrice(
  basePrice: number,
  daysUntilDeparture: number,
  seatAvailability: number,
  isWeekend: boolean,
  isHoliday: boolean,
  seasonalityIndex: number,
  demandScore: number
): number {
  let multiplier = 1.0;
  
  // Days until departure - major factor
  if (daysUntilDeparture < 3) {
    multiplier += randomInRange(0.6, 0.8); // +60-80% last minute
  } else if (daysUntilDeparture < 7) {
    multiplier += randomInRange(0.4, 0.6); // +40-60%
  } else if (daysUntilDeparture < 14) {
    multiplier += randomInRange(0.25, 0.35); // +25-35%
  } else if (daysUntilDeparture < 21) {
    multiplier += randomInRange(0.1, 0.2); // +10-20%
  } else if (daysUntilDeparture < 30) {
    multiplier += randomInRange(0, 0.1); // +0-10%
  } else if (daysUntilDeparture > 60) {
    multiplier -= randomInRange(0.05, 0.15); // -5-15% early bird
  } else if (daysUntilDeparture > 45) {
    multiplier -= randomInRange(0, 0.08); // -0-8%
  }
  
  // Weekend pricing
  if (isWeekend) {
    multiplier += randomInRange(0.15, 0.25); // +15-25%
  }
  
  // Holiday pricing - significant impact
  if (isHoliday) {
    multiplier += randomInRange(0.35, 0.5); // +35-50%
  }
  
  // Seat availability - scarcity pricing
  if (seatAvailability < 0.1) {
    multiplier += randomInRange(0.25, 0.4); // Critical low - big increase
  } else if (seatAvailability < 0.2) {
    multiplier += randomInRange(0.12, 0.2); // +12-20%
  } else if (seatAvailability < 0.4) {
    multiplier += randomInRange(0.05, 0.12); // +5-12%
  } else if (seatAvailability > 0.8) {
    multiplier -= randomInRange(0.03, 0.08); // Lots of seats - slight discount
  }
  
  // Seasonality
  if (seasonalityIndex > 0.8) {
    multiplier += randomInRange(0.2, 0.35); // Peak season
  } else if (seasonalityIndex > 0.6) {
    multiplier += randomInRange(0.1, 0.2); // High season
  } else if (seasonalityIndex < 0.4) {
    multiplier -= randomInRange(0.05, 0.15); // Off-season discount
  }
  
  // Demand score
  if (demandScore > 0.8) {
    multiplier += randomInRange(0.1, 0.2); // High demand
  } else if (demandScore > 0.6) {
    multiplier += randomInRange(0.05, 0.1);
  } else if (demandScore < 0.3) {
    multiplier -= randomInRange(0.03, 0.08); // Low demand discount
  }
  
  // Add random noise for realism
  multiplier = addNoise(multiplier, 0.03);
  
  // Cap multiplier
  multiplier = Math.max(0.6, Math.min(2.2, multiplier));
  
  return Math.round(basePrice * multiplier);
}

/**
 * Generate a single training sample
 */
function generateSample(sampleId: number): TrainingDataSample {
  // Random route
  const route = SAMPLE_ROUTES[Math.floor(Math.random() * SAMPLE_ROUTES.length)];
  const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
  
  // Random dates (search within past 6 months, departure up to 90 days from search)
  const now = new Date();
  const searchDateStart = new Date(now);
  searchDateStart.setMonth(searchDateStart.getMonth() - 6);
  const searchDate = randomDate(searchDateStart, now);
  
  // Departure 1-90 days from search
  const daysUntilDeparture = Math.floor(randomInRange(1, 90));
  const departureDate = new Date(searchDate);
  departureDate.setDate(departureDate.getDate() + daysUntilDeparture);
  
  // Random seat availability (weighted towards middle range)
  let seatAvailability: number;
  const rand = Math.random();
  if (rand < 0.1) {
    seatAvailability = randomInRange(0.05, 0.2); // 10% chance of very low availability
  } else if (rand < 0.25) {
    seatAvailability = randomInRange(0.2, 0.4); // 15% low-medium
  } else if (rand < 0.75) {
    seatAvailability = randomInRange(0.4, 0.7); // 50% medium
  } else {
    seatAvailability = randomInRange(0.7, 0.95); // 25% high availability
  }
  
  // Day of week (0-6, Monday to Sunday)
  const dayOfWeek = (departureDate.getDay() + 6) % 7;
  
  // Weekend (Friday, Saturday, Sunday)
  const isWeekend = dayOfWeek >= 4;
  
  // Holiday check
  const holidayInfo = isIndianHoliday(departureDate);
  const isHoliday = holidayInfo.isHoliday;
  
  // Time of day (random flight time)
  const hour = Math.floor(randomInRange(5, 23));
  departureDate.setHours(hour);
  let timeOfDayNormalized: number;
  if (hour >= 5 && hour < 12) {
    timeOfDayNormalized = 0.25;
  } else if (hour >= 12 && hour < 17) {
    timeOfDayNormalized = 0.5;
  } else if (hour >= 17 && hour < 21) {
    timeOfDayNormalized = 0.75;
  } else {
    timeOfDayNormalized = 1.0;
  }
  
  // Seasonality
  const seasonalityIndex = getSeasonality(departureDate);
  
  // Route popularity (weighted random - some routes more popular)
  let routePopularity: number;
  if (route.origin === 'DEL' || route.destination === 'DEL') {
    routePopularity = randomInRange(0.6, 0.95); // Delhi routes are popular
  } else if (route.origin === 'BOM' || route.destination === 'BOM') {
    routePopularity = randomInRange(0.5, 0.85);
  } else {
    routePopularity = randomInRange(0.3, 0.7);
  }
  
  // Demand score (correlated with popularity and seasonality)
  let demandScore = routePopularity * 0.5 + seasonalityIndex * 0.3 + Math.random() * 0.2;
  demandScore = Math.max(0, Math.min(1, demandScore));
  
  // Base price with airline factor
  const basePrice = Math.round(route.basePrice * airline.qualityFactor);
  
  // Calculate final price
  const finalPrice = calculateRealisticPrice(
    basePrice,
    daysUntilDeparture,
    seatAvailability,
    isWeekend,
    isHoliday,
    seasonalityIndex,
    demandScore
  );
  
  // Price multiplier (target for ML)
  const priceMultiplier = finalPrice / basePrice;
  
  // Normalized features for model
  const features: ModelFeatures = {
    daysUntilDeparture: Math.max(0, Math.min(1, 1 - (daysUntilDeparture / 90))),
    seatAvailability,
    dayOfWeek: dayOfWeek / 6,
    isWeekend: isWeekend ? 1 : 0,
    isHoliday: isHoliday ? 1 : 0,
    timeOfDay: timeOfDayNormalized,
    seasonalityIndex,
    routePopularity,
    demandScore
  };
  
  return {
    features,
    priceMultiplier,
    metadata: {
      flightId: `SYNTH-${sampleId}`,
      flightNumber: `${airline.code}${Math.floor(randomInRange(100, 9999))}`,
      route: `${route.origin}-${route.destination}`,
      basePrice,
      finalPrice,
      searchDate,
      departureDate
    }
  };
}

/**
 * Generate historical training data
 */
export async function generateHistoricalData(count: number = 1000): Promise<TrainingData> {
  console.log(`Generating ${count} training samples...`);
  
  const samples: TrainingDataSample[] = [];
  
  for (let i = 0; i < count; i++) {
    const sample = generateSample(i + 1);
    samples.push(sample);
    
    if ((i + 1) % 100 === 0) {
      console.log(`  Generated ${i + 1}/${count} samples`);
    }
  }
  
  const trainingData: TrainingData = {
    samples,
    generatedAt: new Date(),
    sampleCount: count,
    featureNames: [
      'daysUntilDeparture',
      'seatAvailability',
      'dayOfWeek',
      'isWeekend',
      'isHoliday',
      'timeOfDay',
      'seasonalityIndex',
      'routePopularity',
      'demandScore'
    ]
  };
  
  return trainingData;
}

/**
 * Export training data to JSON file
 */
export async function exportToJSON(data: TrainingData, filename: string = 'training_data.json'): Promise<string> {
  const dataDir = path.join(__dirname, '../../data');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filePath = path.join(dataDir, filename);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Training data exported to: ${filePath}`);
  
  return filePath;
}

/**
 * Export training data to CSV file
 */
export async function exportToCSV(data: TrainingData, filename: string = 'training_data.csv'): Promise<string> {
  const dataDir = path.join(__dirname, '../../data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filePath = path.join(dataDir, filename);
  
  // Header
  const header = [...data.featureNames, 'priceMultiplier'].join(',');
  
  // Data rows
  const rows = data.samples.map(sample => {
    const features = data.featureNames.map(name => 
      sample.features[name as keyof ModelFeatures].toFixed(6)
    );
    return [...features, sample.priceMultiplier.toFixed(6)].join(',');
  });
  
  const csvContent = [header, ...rows].join('\n');
  
  fs.writeFileSync(filePath, csvContent);
  console.log(`Training data exported to: ${filePath}`);
  
  return filePath;
}

/**
 * Load training data from JSON file
 */
export function loadTrainingData(filename: string = 'training_data.json'): TrainingData | null {
  const dataDir = path.join(__dirname, '../../data');
  const filePath = path.join(dataDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Training data file not found: ${filePath}`);
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as TrainingData;
}

/**
 * Generate and export training data (main function)
 */
export async function generateAndExportData(count: number = 1000): Promise<void> {
  console.log('=== Training Data Generator ===\n');
  
  // Generate data
  const data = await generateHistoricalData(count);
  
  // Export to both formats
  await exportToJSON(data);
  await exportToCSV(data);
  
  // Print statistics
  console.log('\n=== Data Statistics ===');
  console.log(`Total samples: ${data.sampleCount}`);
  
  const multipliers = data.samples.map(s => s.priceMultiplier);
  const minMult = Math.min(...multipliers);
  const maxMult = Math.max(...multipliers);
  const avgMult = multipliers.reduce((a, b) => a + b, 0) / multipliers.length;
  
  console.log(`Price multiplier range: ${minMult.toFixed(3)} - ${maxMult.toFixed(3)}`);
  console.log(`Average multiplier: ${avgMult.toFixed(3)}`);
  
  // Feature distributions
  console.log('\n=== Feature Distributions ===');
  for (const featureName of data.featureNames) {
    const values = data.samples.map(s => s.features[featureName as keyof ModelFeatures]);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    console.log(`${featureName}: avg=${avg.toFixed(3)}`);
  }
  
  console.log('\nTraining data generation complete!');
}

// CLI execution
if (process.argv[1].includes('generateTrainingData')) {
  const count = parseInt(process.argv[2]) || 1000;
  
  generateAndExportData(count)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error generating training data:', error);
      process.exit(1);
    });
}

export default {
  generateHistoricalData,
  exportToJSON,
  exportToCSV,
  loadTrainingData,
  generateAndExportData
};
