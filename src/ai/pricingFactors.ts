/**
 * Pricing Factors Calculator
 * Calculates all factors that influence dynamic pricing
 */

import { PricingFactors, ModelFeatures, IndianHoliday } from './types.js';
import { Booking } from '../models/Booking.js';

// Indian Holidays for 2025-2026
const INDIAN_HOLIDAYS: IndianHoliday[] = [
  // 2025
  { name: 'Republic Day', date: new Date('2025-01-26'), type: 'national', impactMultiplier: 1.3 },
  { name: 'Holi', date: new Date('2025-03-14'), type: 'religious', impactMultiplier: 1.4 },
  { name: 'Good Friday', date: new Date('2025-04-18'), type: 'religious', impactMultiplier: 1.2 },
  { name: 'Ram Navami', date: new Date('2025-04-06'), type: 'religious', impactMultiplier: 1.2 },
  { name: 'Eid ul-Fitr', date: new Date('2025-03-31'), type: 'religious', impactMultiplier: 1.4 },
  { name: 'Buddha Purnima', date: new Date('2025-05-12'), type: 'religious', impactMultiplier: 1.1 },
  { name: 'Independence Day', date: new Date('2025-08-15'), type: 'national', impactMultiplier: 1.35 },
  { name: 'Janmashtami', date: new Date('2025-08-16'), type: 'religious', impactMultiplier: 1.25 },
  { name: 'Ganesh Chaturthi', date: new Date('2025-08-27'), type: 'religious', impactMultiplier: 1.3 },
  { name: 'Onam', date: new Date('2025-09-05'), type: 'regional', impactMultiplier: 1.25 },
  { name: 'Navratri Start', date: new Date('2025-09-22'), type: 'religious', impactMultiplier: 1.3 },
  { name: 'Dussehra', date: new Date('2025-10-02'), type: 'national', impactMultiplier: 1.4 },
  { name: 'Gandhi Jayanti', date: new Date('2025-10-02'), type: 'national', impactMultiplier: 1.2 },
  { name: 'Karwa Chauth', date: new Date('2025-10-10'), type: 'cultural', impactMultiplier: 1.15 },
  { name: 'Diwali', date: new Date('2025-10-20'), type: 'national', impactMultiplier: 1.5 },
  { name: 'Bhai Dooj', date: new Date('2025-10-23'), type: 'cultural', impactMultiplier: 1.3 },
  { name: 'Guru Nanak Jayanti', date: new Date('2025-11-05'), type: 'religious', impactMultiplier: 1.2 },
  { name: 'Christmas', date: new Date('2025-12-25'), type: 'religious', impactMultiplier: 1.35 },
  { name: 'New Year Eve', date: new Date('2025-12-31'), type: 'cultural', impactMultiplier: 1.4 },
  
  // 2026
  { name: 'New Year', date: new Date('2026-01-01'), type: 'cultural', impactMultiplier: 1.3 },
  { name: 'Republic Day', date: new Date('2026-01-26'), type: 'national', impactMultiplier: 1.3 },
  { name: 'Holi', date: new Date('2026-03-04'), type: 'religious', impactMultiplier: 1.4 },
  { name: 'Good Friday', date: new Date('2026-04-03'), type: 'religious', impactMultiplier: 1.2 },
  { name: 'Eid ul-Fitr', date: new Date('2026-03-20'), type: 'religious', impactMultiplier: 1.4 },
  { name: 'Independence Day', date: new Date('2026-08-15'), type: 'national', impactMultiplier: 1.35 },
  { name: 'Dussehra', date: new Date('2026-10-20'), type: 'national', impactMultiplier: 1.4 },
  { name: 'Diwali', date: new Date('2026-11-08'), type: 'national', impactMultiplier: 1.5 },
  { name: 'Christmas', date: new Date('2026-12-25'), type: 'religious', impactMultiplier: 1.35 },
];

// Peak travel seasons in India
const PEAK_SEASONS = [
  { start: { month: 10, day: 1 }, end: { month: 10, day: 31 }, factor: 0.9 }, // October - Festival season
  { start: { month: 11, day: 1 }, end: { month: 11, day: 30 }, factor: 0.85 }, // November - Post Diwali
  { start: { month: 12, day: 15 }, end: { month: 12, day: 31 }, factor: 1.0 }, // Christmas/New Year
  { start: { month: 1, day: 1 }, end: { month: 1, day: 15 }, factor: 0.95 }, // New Year
  { start: { month: 3, day: 1 }, end: { month: 3, day: 31 }, factor: 0.8 }, // Holi season
  { start: { month: 4, day: 15 }, end: { month: 5, day: 31 }, factor: 0.75 }, // Summer vacations
  { start: { month: 6, day: 1 }, end: { month: 8, day: 31 }, factor: 0.5 }, // Monsoon - off-season
  { start: { month: 9, day: 1 }, end: { month: 9, day: 30 }, factor: 0.6 }, // Post monsoon
];

// Route popularity cache
let routePopularityCache: Map<string, number> = new Map();
let cacheLastUpdated: Date | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Check if a date is an Indian holiday
 */
export function isIndianHoliday(date: Date): { isHoliday: boolean; holiday?: IndianHoliday } {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  // Check exact date match
  for (const holiday of INDIAN_HOLIDAYS) {
    const holidayDate = new Date(holiday.date);
    holidayDate.setHours(0, 0, 0, 0);
    
    // Check exact match or within 1 day (extended holiday effect)
    const diffDays = Math.abs((checkDate.getTime() - holidayDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
      return { isHoliday: true, holiday };
    }
  }
  
  // Check if date is in a holiday week (long weekends)
  for (const holiday of INDIAN_HOLIDAYS) {
    const holidayDate = new Date(holiday.date);
    const dayOfWeek = holidayDate.getDay();
    
    // If holiday is Thu/Tue, extend to weekend
    if (dayOfWeek === 4 || dayOfWeek === 2) {
      const startOfWeek = new Date(holidayDate);
      startOfWeek.setDate(holidayDate.getDate() - 3);
      const endOfWeek = new Date(holidayDate);
      endOfWeek.setDate(holidayDate.getDate() + 3);
      
      if (checkDate >= startOfWeek && checkDate <= endOfWeek) {
        return { isHoliday: true, holiday: { ...holiday, impactMultiplier: holiday.impactMultiplier * 0.8 } };
      }
    }
  }
  
  return { isHoliday: false };
}

/**
 * Get seasonality index for a given month
 * Returns 0-1 (1 = peak season, 0 = off-season)
 */
export function getSeasonality(date: Date): number {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  
  for (const season of PEAK_SEASONS) {
    const isInSeason = 
      (month > season.start.month || (month === season.start.month && day >= season.start.day)) &&
      (month < season.end.month || (month === season.end.month && day <= season.end.day));
    
    if (isInSeason) {
      return season.factor;
    }
  }
  
  // Default moderate season
  return 0.6;
}

/**
 * Calculate demand score based on recent searches and bookings
 */
export async function calculateDemandScore(
  originCode: string, 
  destinationCode: string, 
  pastDays: number = 7
): Promise<number> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - pastDays);
    
    // Count recent bookings for this route
    const bookingCount = await Booking.countDocuments({
      'flight.origin.airportCode': originCode,
      'flight.destination.airportCode': destinationCode,
      createdAt: { $gte: startDate },
      status: { $in: ['confirmed', 'pending'] }
    });
    
    // Get total bookings in the period for comparison
    const totalBookings = await Booking.countDocuments({
      createdAt: { $gte: startDate },
      status: { $in: ['confirmed', 'pending'] }
    });
    
    // Get unique routes count
    const uniqueRoutes = await Booking.distinct('flight.origin.airportCode', {
      createdAt: { $gte: startDate }
    });
    
    if (totalBookings === 0 || uniqueRoutes.length === 0) {
      return 0.5; // Default moderate demand
    }
    
    // Calculate relative demand
    const avgBookingsPerRoute = totalBookings / uniqueRoutes.length;
    const demandRatio = bookingCount / avgBookingsPerRoute;
    
    // Normalize to 0-1 (cap at 2x average)
    return Math.min(demandRatio / 2, 1);
  } catch (error) {
    console.error('Error calculating demand score:', error);
    return 0.5; // Default on error
  }
}

/**
 * Get route popularity score
 */
export async function getRoutePopularity(
  originCode: string, 
  destinationCode: string
): Promise<number> {
  const routeKey = `${originCode}-${destinationCode}`;
  
  // Check cache
  if (routePopularityCache.has(routeKey) && cacheLastUpdated && 
      (Date.now() - cacheLastUpdated.getTime()) < CACHE_TTL) {
    return routePopularityCache.get(routeKey) || 0.5;
  }
  
  try {
    // Get all-time booking counts per route
    const routeStats = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { 
        $group: {
          _id: {
            origin: '$flight.origin.airportCode',
            destination: '$flight.destination.airportCode'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    if (routeStats.length === 0) {
      return 0.5;
    }
    
    const maxCount = routeStats[0].count;
    
    // Update cache for all routes
    routePopularityCache.clear();
    for (const stat of routeStats) {
      const key = `${stat._id.origin}-${stat._id.destination}`;
      routePopularityCache.set(key, stat.count / maxCount);
    }
    cacheLastUpdated = new Date();
    
    return routePopularityCache.get(routeKey) || 0.3; // New routes get lower score
  } catch (error) {
    console.error('Error calculating route popularity:', error);
    return 0.5;
  }
}

/**
 * Get time of day category
 */
export function getTimeOfDay(date: Date): { 
  category: 'morning' | 'afternoon' | 'evening' | 'night';
  normalized: number;
} {
  const hours = date.getHours();
  
  if (hours >= 5 && hours < 12) {
    return { category: 'morning', normalized: 0.25 };
  } else if (hours >= 12 && hours < 17) {
    return { category: 'afternoon', normalized: 0.5 };
  } else if (hours >= 17 && hours < 21) {
    return { category: 'evening', normalized: 0.75 };
  } else {
    return { category: 'night', normalized: 1.0 };
  }
}

/**
 * Calculate all pricing factors for a flight
 */
export async function calculatePricingFactors(
  flight: any,
  searchDate: Date = new Date()
): Promise<PricingFactors> {
  const departureDate = new Date(flight.departureTime);
  
  // Days until departure
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilDeparture = Math.max(0, 
    Math.floor((departureDate.getTime() - searchDate.getTime()) / msPerDay)
  );
  // Normalize: 0 = 90+ days (best), 1 = departing today (worst)
  const daysUntilDepartureNormalized = Math.max(0, Math.min(1, 1 - (daysUntilDeparture / 90)));
  
  // Seat availability
  const totalSeats = flight.totalSeats || 180;
  const availableSeats = flight.availableSeats || totalSeats;
  const seatAvailability = availableSeats / totalSeats;
  
  // Day of week
  const dayOfWeek = (departureDate.getDay() + 6) % 7; // Convert to Monday=0, Sunday=6
  const dayOfWeekNormalized = dayOfWeek / 6;
  
  // Is weekend (Friday evening onwards, Saturday, Sunday)
  const isWeekend = dayOfWeek >= 4; // Friday, Saturday, Sunday
  const isWeekendNormalized = isWeekend ? 1 : 0;
  
  // Holiday check
  const holidayCheck = isIndianHoliday(departureDate);
  const isHoliday = holidayCheck.isHoliday;
  const isHolidayNormalized = isHoliday ? (holidayCheck.holiday?.impactMultiplier || 1.3) / 1.5 : 0;
  
  // Time of day
  const timeOfDayInfo = getTimeOfDay(departureDate);
  
  // Seasonality
  const seasonalityIndex = getSeasonality(departureDate);
  
  // Route popularity and demand
  const originCode = flight.origin?.airportCode || 'DEL';
  const destinationCode = flight.destination?.airportCode || 'BOM';
  
  const routePopularity = await getRoutePopularity(originCode, destinationCode);
  const demandScore = await calculateDemandScore(originCode, destinationCode);
  
  return {
    daysUntilDeparture,
    daysUntilDepartureNormalized,
    seatAvailability,
    dayOfWeek,
    dayOfWeekNormalized,
    isWeekend,
    isWeekendNormalized,
    isHoliday,
    isHolidayNormalized,
    timeOfDay: timeOfDayInfo.category,
    timeOfDayNormalized: timeOfDayInfo.normalized,
    seasonalityIndex,
    routePopularity,
    demandScore
  };
}

/**
 * Convert pricing factors to model features (normalized 0-1)
 */
export function factorsToModelFeatures(factors: PricingFactors): ModelFeatures {
  return {
    daysUntilDeparture: factors.daysUntilDepartureNormalized,
    seatAvailability: factors.seatAvailability,
    dayOfWeek: factors.dayOfWeekNormalized,
    isWeekend: factors.isWeekendNormalized,
    isHoliday: factors.isHolidayNormalized,
    timeOfDay: factors.timeOfDayNormalized,
    seasonalityIndex: factors.seasonalityIndex,
    routePopularity: factors.routePopularity,
    demandScore: factors.demandScore
  };
}

/**
 * Get feature array for TensorFlow
 */
export function getFeatureArray(features: ModelFeatures): number[] {
  return [
    features.daysUntilDeparture,
    features.seatAvailability,
    features.dayOfWeek,
    features.isWeekend,
    features.isHoliday,
    features.timeOfDay,
    features.seasonalityIndex,
    features.routePopularity,
    features.demandScore
  ];
}

/**
 * Calculate rule-based price multiplier (fallback when AI model unavailable)
 */
export function calculateRuleBasedMultiplier(factors: PricingFactors): number {
  let multiplier = 1.0;
  
  // Days until departure pricing
  if (factors.daysUntilDeparture < 7) {
    multiplier += 0.5; // +50%
  } else if (factors.daysUntilDeparture < 14) {
    multiplier += 0.3; // +30%
  } else if (factors.daysUntilDeparture < 21) {
    multiplier += 0.15; // +15%
  } else if (factors.daysUntilDeparture > 60) {
    multiplier -= 0.1; // -10% early bird
  }
  
  // Weekend pricing
  if (factors.isWeekend) {
    multiplier += 0.2; // +20%
  }
  
  // Holiday pricing
  if (factors.isHoliday) {
    multiplier += 0.4; // +40%
  }
  
  // Seat scarcity
  if (factors.seatAvailability < 0.2) {
    multiplier += 0.15; // +15% when < 20% seats remaining
  } else if (factors.seatAvailability < 0.4) {
    multiplier += 0.08; // +8%
  }
  
  // Peak season
  multiplier += factors.seasonalityIndex * 0.25;
  
  // High demand routes
  if (factors.demandScore > 0.7) {
    multiplier += 0.1; // +10%
  }
  
  // Cap multiplier between 0.7 and 2.0
  return Math.max(0.7, Math.min(2.0, multiplier));
}

export default {
  calculatePricingFactors,
  factorsToModelFeatures,
  getFeatureArray,
  calculateRuleBasedMultiplier,
  isIndianHoliday,
  getSeasonality,
  calculateDemandScore,
  getRoutePopularity,
  getTimeOfDay
};
