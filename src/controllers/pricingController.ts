/**
 * Pricing Controller
 * API endpoints for AI-powered dynamic pricing
 */

import { Request, Response } from 'express';
import pricingService from '../services/pricingService.js';
import { Flight, IFlight } from '../models/Flight.js';

/**
 * Get predicted price for a flight
 * POST /api/pricing/predict
 */
export const getPredictedPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flightId, searchDate } = req.body;

    if (!flightId) {
      res.status(400).json({
        success: false,
        message: 'Flight ID is required'
      });
      return;
    }

    // Get flight from database
    const flight = await Flight.findById(flightId);

    if (!flight) {
      res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
      return;
    }

    // Get AI prediction
    const prediction = await pricingService.predictPrice(
      flight,
      searchDate ? new Date(searchDate) : new Date()
    );

    res.status(200).json({
      success: true,
      data: {
        flightId: flight._id,
        flightNumber: flight.flightNumber,
        ...prediction,
        currency: flight.currency || 'INR',
        modelStatus: pricingService.isReady() ? 'ai' : 'rule-based'
      }
    });
  } catch (error: any) {
    console.error('[PricingController] getPredictedPrice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict price',
      error: error.message
    });
  }
};

/**
 * Get predicted prices for multiple flights
 * POST /api/pricing/predict-batch
 */
export const getPredictedPricesBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flightIds, searchDate } = req.body;

    if (!flightIds || !Array.isArray(flightIds) || flightIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Flight IDs array is required'
      });
      return;
    }

    // Limit batch size
    if (flightIds.length > 50) {
      res.status(400).json({
        success: false,
        message: 'Maximum 50 flights per batch'
      });
      return;
    }

    // Get flights from database
    const flights = await Flight.find({ _id: { $in: flightIds } });

    if (flights.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No flights found'
      });
      return;
    }

    // Get predictions for all flights
    const predictionsMap = await pricingService.predictPricesForFlights(
      flights,
      searchDate ? new Date(searchDate) : new Date()
    );

    // Convert map to array
    const predictions = flights.map((flight: IFlight) => {
      const prediction = predictionsMap.get(flight._id.toString());
      return {
        flightId: flight._id,
        flightNumber: flight.flightNumber,
        ...prediction,
        currency: flight.currency || 'INR'
      };
    });

    res.status(200).json({
      success: true,
      data: predictions,
      count: predictions.length,
      modelStatus: pricingService.isReady() ? 'ai' : 'rule-based'
    });
  } catch (error: any) {
    console.error('[PricingController] getPredictedPricesBatch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict prices',
      error: error.message
    });
  }
};

/**
 * Get price history for a flight
 * GET /api/pricing/history/:flightId
 */
export const getPriceHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flightId } = req.params;
    const { days = 30 } = req.query;

    if (!flightId) {
      res.status(400).json({
        success: false,
        message: 'Flight ID is required'
      });
      return;
    }

    const flight = await Flight.findById(flightId).select('flightNumber currentPrice basePrice');

    if (!flight) {
      res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
      return;
    }

    const history = await pricingService.getPriceHistory(
      flightId,
      parseInt(days as string)
    );

    res.status(200).json({
      success: true,
      data: {
        flightId,
        flightNumber: flight.flightNumber,
        currentPrice: flight.currentPrice,
        basePrice: flight.basePrice,
        history,
        historyCount: history.length
      }
    });
  } catch (error: any) {
    console.error('[PricingController] getPriceHistory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get price history',
      error: error.message
    });
  }
};

/**
 * Update price for a single flight (Admin)
 * POST /api/pricing/update/:flightId
 */
export const updateFlightPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flightId } = req.params;

    if (!flightId) {
      res.status(400).json({
        success: false,
        message: 'Flight ID is required'
      });
      return;
    }

    const result = await pricingService.updateFlightPrice(flightId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Flight price updated successfully',
        data: {
          flightId,
          oldPrice: result.oldPrice,
          newPrice: result.newPrice,
          change: result.newPrice! - result.oldPrice!,
          changePercent: ((result.newPrice! - result.oldPrice!) / result.oldPrice! * 100).toFixed(2)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to update price'
      });
    }
  } catch (error: any) {
    console.error('[PricingController] updateFlightPrice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update flight price',
      error: error.message
    });
  }
};

/**
 * Batch update all flight prices (Admin)
 * POST /api/pricing/update-all
 */
export const updateAllPrices = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('[PricingController] Starting batch price update...');

    const result = await pricingService.updateAllPrices();

    res.status(200).json({
      success: true,
      message: `Batch price update completed`,
      data: {
        totalFlights: result.totalFlights,
        updated: result.updated,
        failed: result.failed,
        skipped: result.skipped,
        durationMs: result.duration,
        durationFormatted: `${(result.duration / 1000).toFixed(2)}s`,
        errors: result.errors.slice(0, 10) // Return first 10 errors only
      }
    });
  } catch (error: any) {
    console.error('[PricingController] updateAllPrices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prices',
      error: error.message
    });
  }
};

/**
 * Get pricing service status and stats (Admin)
 * GET /api/pricing/stats
 */
export const getPricingStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await pricingService.getPricingStats();

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        modelReady: pricingService.isReady()
      }
    });
  } catch (error: any) {
    console.error('[PricingController] getPricingStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pricing stats',
      error: error.message
    });
  }
};

/**
 * Get price trend for a route
 * GET /api/pricing/trend
 */
export const getPriceTrend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, destination, departureDate } = req.query;

    if (!origin || !destination) {
      res.status(400).json({
        success: false,
        message: 'Origin and destination are required'
      });
      return;
    }

    // Find flights for this route
    const query: any = {
      'origin.airportCode': (origin as string).toUpperCase(),
      'destination.airportCode': (destination as string).toUpperCase(),
      isActive: true
    };

    if (departureDate) {
      const date = new Date(departureDate as string);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      query.departureTime = { $gte: date, $lt: nextDay };
    } else {
      // Default to next 7 days
      const now = new Date();
      const weekLater = new Date(now);
      weekLater.setDate(weekLater.getDate() + 7);
      query.departureTime = { $gte: now, $lte: weekLater };
    }

    const flights = await Flight.find(query)
      .select('flightNumber currentPrice basePrice departureTime priceHistory')
      .sort({ departureTime: 1 })
      .limit(20);

    if (flights.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No flights found for this route'
      });
      return;
    }

    // Calculate trend data
    const prices = flights.map((f: IFlight) => f.currentPrice);
    const avgPrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Get predictions for trend
    const predictions = await pricingService.predictPricesForFlights(flights);
    
    // Calculate overall trend
    let risingCount = 0;
    let fallingCount = 0;
    predictions.forEach(pred => {
      if (pred.trend === 'rising') risingCount++;
      if (pred.trend === 'falling') fallingCount++;
    });

    let overallTrend: 'rising' | 'falling' | 'stable' = 'stable';
    if (risingCount > fallingCount + 2) overallTrend = 'rising';
    if (fallingCount > risingCount + 2) overallTrend = 'falling';

    res.status(200).json({
      success: true,
      data: {
        route: `${origin} → ${destination}`,
        flightCount: flights.length,
        priceRange: { min: minPrice, max: maxPrice, average: Math.round(avgPrice) },
        trend: overallTrend,
        recommendation: overallTrend === 'rising' 
          ? 'Book soon - prices are trending upward'
          : overallTrend === 'falling'
          ? 'Prices may drop further - consider waiting'
          : 'Prices are stable - book at your convenience',
        flights: flights.map((f: IFlight) => {
          const pred = predictions.get(f._id.toString());
          return {
            flightId: f._id,
            flightNumber: f.flightNumber,
            departureTime: f.departureTime,
            currentPrice: f.currentPrice,
            predictedPrice: pred?.predictedPrice,
            trend: pred?.trend
          };
        })
      }
    });
  } catch (error: any) {
    console.error('[PricingController] getPriceTrend error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get price trend',
      error: error.message
    });
  }
};

export default {
  getPredictedPrice,
  getPredictedPricesBatch,
  getPriceHistory,
  updateFlightPrice,
  updateAllPrices,
  getPricingStats,
  getPriceTrend
};
