/**
 * AI Pricing Service
 * Singleton service for flight price predictions using TensorFlow.js
 */

import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  PredictionResult, 
  PricingFactors,
  PriceHistoryEntry,
  BatchPricingResult 
} from '../ai/types.js';
import { 
  calculatePricingFactors, 
  factorsToModelFeatures, 
  getFeatureArray,
  calculateRuleBasedMultiplier 
} from '../ai/pricingFactors.js';
import { Flight, IFlight, IPriceHistory } from '../models/Flight.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * PricingService - Singleton class for AI-powered pricing
 */
class PricingService {
  private static instance: PricingService;
  private model: tf.LayersModel | null = null;
  private isModelLoaded: boolean = false;
  private modelPath: string;
  private loadPromise: Promise<void> | null = null;

  private constructor() {
    this.modelPath = path.join(__dirname, '../../models/pricing-model');
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  /**
   * Load the trained TensorFlow model
   */
  public async loadModel(): Promise<boolean> {
    // Return existing load promise if already loading
    if (this.loadPromise) {
      await this.loadPromise;
      return this.isModelLoaded;
    }

    // Already loaded
    if (this.isModelLoaded && this.model) {
      return true;
    }

    this.loadPromise = this._loadModelInternal();
    await this.loadPromise;
    this.loadPromise = null;
    
    return this.isModelLoaded;
  }

  private async _loadModelInternal(): Promise<void> {
    try {
      const modelJsonPath = path.join(this.modelPath, 'model.json');
      
      if (!fs.existsSync(modelJsonPath)) {
        console.warn(`[PricingService] Model not found at: ${this.modelPath}`);
        console.warn('[PricingService] Using rule-based pricing as fallback');
        this.isModelLoaded = false;
        return;
      }

      console.log(`[PricingService] Loading model from: ${this.modelPath}`);
      this.model = await tf.loadLayersModel(`file://${modelJsonPath}`);
      
      // Warm up the model with a dummy prediction
      const dummyInput = tf.zeros([1, 9]);
      const warmUp = this.model.predict(dummyInput) as tf.Tensor;
      warmUp.dispose();
      dummyInput.dispose();
      
      this.isModelLoaded = true;
      console.log('[PricingService] Model loaded successfully');
    } catch (error) {
      console.error('[PricingService] Failed to load model:', error);
      this.isModelLoaded = false;
    }
  }

  /**
   * Check if model is ready
   */
  public isReady(): boolean {
    return this.isModelLoaded && this.model !== null;
  }

  /**
   * Predict price for a flight
   */
  public async predictPrice(
    flight: IFlight | any,
    searchDate: Date = new Date()
  ): Promise<PredictionResult> {
    // Calculate pricing factors
    const factors = await calculatePricingFactors(flight, searchDate);
    const features = factorsToModelFeatures(factors);
    
    // Get base price
    const basePrice = flight.basePrice || flight.currentPrice || flight.prices?.economy || 5000;
    
    let priceMultiplier: number;
    let confidence: number;
    
    if (this.isReady() && this.model) {
      // Use AI model
      const featureArray = getFeatureArray(features);
      const inputTensor = tf.tensor2d([featureArray], [1, 9]);
      
      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      priceMultiplier = prediction.dataSync()[0];
      
      inputTensor.dispose();
      prediction.dispose();
      
      // Clamp multiplier to reasonable range
      priceMultiplier = Math.max(0.6, Math.min(2.2, priceMultiplier));
      confidence = 0.85; // AI prediction confidence
    } else {
      // Fallback to rule-based pricing
      priceMultiplier = calculateRuleBasedMultiplier(factors);
      confidence = 0.6; // Lower confidence for rule-based
    }
    
    const predictedPrice = Math.round(basePrice * priceMultiplier);
    const discount = basePrice - predictedPrice;
    const discountPercentage = (discount / basePrice) * 100;
    
    // Determine price trend
    let trend: 'rising' | 'falling' | 'stable' = 'stable';
    if (priceMultiplier > 1.1) {
      trend = 'rising';
    } else if (priceMultiplier < 0.95) {
      trend = 'falling';
    }
    
    // Generate explanation
    const explanation = this.generateExplanation(factors, priceMultiplier);
    
    return {
      basePrice,
      predictedPrice,
      priceMultiplier,
      discount,
      discountPercentage,
      confidence,
      factors,
      trend,
      explanation
    };
  }

  /**
   * Generate human-readable explanation for the price
   */
  private generateExplanation(factors: PricingFactors, multiplier: number): string {
    const reasons: string[] = [];
    
    if (factors.daysUntilDeparture < 7) {
      reasons.push('last-minute booking');
    } else if (factors.daysUntilDeparture > 60) {
      reasons.push('early bird booking');
    }
    
    if (factors.isHoliday) {
      reasons.push('holiday period');
    }
    
    if (factors.isWeekend) {
      reasons.push('weekend travel');
    }
    
    if (factors.seatAvailability < 0.2) {
      reasons.push('limited seats available');
    }
    
    if (factors.seasonalityIndex > 0.8) {
      reasons.push('peak travel season');
    }
    
    if (factors.demandScore > 0.7) {
      reasons.push('high demand route');
    }
    
    if (reasons.length === 0) {
      return 'Standard pricing applies';
    }
    
    const priceDirection = multiplier > 1 ? 'higher' : multiplier < 1 ? 'lower' : 'standard';
    return `Price is ${priceDirection} due to: ${reasons.join(', ')}`;
  }

  /**
   * Get price history for a flight
   */
  public async getPriceHistory(
    flightId: string, 
    days: number = 30
  ): Promise<PriceHistoryEntry[]> {
    try {
      const flight = await Flight.findById(flightId).select('priceHistory');
      
      if (!flight || !flight.priceHistory) {
        return [];
      }
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return flight.priceHistory
        .filter((entry: IPriceHistory) => new Date(entry.timestamp) >= cutoffDate)
        .map((entry: IPriceHistory) => ({
          price: entry.price,
          timestamp: entry.timestamp,
          predictedBy: 'ai' as const,
          reason: entry.reason
        }))
        .sort((a: PriceHistoryEntry, b: PriceHistoryEntry) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    } catch (error) {
      console.error('[PricingService] Error getting price history:', error);
      return [];
    }
  }

  /**
   * Update a flight's price using AI prediction
   */
  public async updateFlightPrice(flightId: string): Promise<{
    success: boolean;
    oldPrice?: number;
    newPrice?: number;
    error?: string;
  }> {
    try {
      const flight = await Flight.findById(flightId);
      
      if (!flight) {
        return { success: false, error: 'Flight not found' };
      }
      
      const oldPrice = flight.currentPrice;
      const prediction = await this.predictPrice(flight);
      
      // Update flight price
      flight.currentPrice = prediction.predictedPrice;
      flight.priceHistory.push({
        price: prediction.predictedPrice,
        timestamp: new Date(),
        reason: `AI update: ${prediction.explanation}`
      });
      
      // Keep only last 100 price history entries
      if (flight.priceHistory.length > 100) {
        flight.priceHistory = flight.priceHistory.slice(-100);
      }
      
      await flight.save();
      
      return {
        success: true,
        oldPrice,
        newPrice: prediction.predictedPrice
      };
    } catch (error: any) {
      console.error('[PricingService] Error updating flight price:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Batch update prices for all upcoming flights
   */
  public async updateAllPrices(): Promise<BatchPricingResult> {
    const startTime = Date.now();
    const result: BatchPricingResult = {
      totalFlights: 0,
      updated: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      errors: []
    };

    try {
      // Get all upcoming flights
      const now = new Date();
      const flights = await Flight.find({
        departureTime: { $gt: now },
        isActive: true
      }).limit(1000); // Process in batches

      result.totalFlights = flights.length;
      console.log(`[PricingService] Updating prices for ${flights.length} flights...`);

      for (const flight of flights) {
        try {
          const updateResult = await this.updateFlightPrice(flight._id.toString());
          
          if (updateResult.success) {
            result.updated++;
          } else {
            result.failed++;
            result.errors.push({
              flightId: flight._id.toString(),
              error: updateResult.error || 'Unknown error'
            });
          }
        } catch (error: any) {
          result.failed++;
          result.errors.push({
            flightId: flight._id.toString(),
            error: error.message
          });
        }
      }

      result.duration = Date.now() - startTime;
      console.log(
        `[PricingService] Price update complete: ${result.updated} updated, ` +
        `${result.failed} failed, ${result.duration}ms`
      );

      return result;
    } catch (error: any) {
      console.error('[PricingService] Batch update failed:', error);
      result.duration = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Predict prices for multiple flights (bulk operation)
   */
  public async predictPricesForFlights(
    flights: (IFlight | any)[],
    searchDate: Date = new Date()
  ): Promise<Map<string, PredictionResult>> {
    const results = new Map<string, PredictionResult>();

    for (const flight of flights) {
      try {
        const flightId = flight._id?.toString() || flight.id;
        const prediction = await this.predictPrice(flight, searchDate);
        results.set(flightId, prediction);
      } catch (error) {
        console.error(`[PricingService] Error predicting price for flight:`, error);
      }
    }

    return results;
  }

  /**
   * Get pricing statistics
   */
  public async getPricingStats(): Promise<{
    modelStatus: string;
    averageMultiplier: number;
    updatedToday: number;
  }> {
    const modelStatus = this.isReady() ? 'AI Model Active' : 'Rule-Based Fallback';
    
    // Get stats from recent price updates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
      const flights = await Flight.find({
        'priceHistory.timestamp': { $gte: today }
      }).select('priceHistory basePrice currentPrice');

      let totalMultiplier = 0;
      let count = 0;

      flights.forEach((flight: IFlight) => {
        if (flight.basePrice && flight.currentPrice) {
          totalMultiplier += flight.currentPrice / flight.basePrice;
          count++;
        }
      });

      return {
        modelStatus,
        averageMultiplier: count > 0 ? totalMultiplier / count : 1.0,
        updatedToday: flights.length
      };
    } catch (error) {
      return {
        modelStatus,
        averageMultiplier: 1.0,
        updatedToday: 0
      };
    }
  }
}

// Export singleton instance
export const pricingService = PricingService.getInstance();
export default pricingService;
