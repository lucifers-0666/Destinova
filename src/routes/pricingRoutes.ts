/**
 * Pricing Routes
 * API endpoints for AI-powered dynamic pricing
 */

import { Router } from 'express';
import {
  getPredictedPrice,
  getPredictedPricesBatch,
  getPriceHistory,
  updateFlightPrice,
  updateAllPrices,
  getPricingStats,
  getPriceTrend
} from '../controllers/pricingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/predict', getPredictedPrice);
router.post('/predict-batch', getPredictedPricesBatch);
router.get('/history/:flightId', getPriceHistory);
router.get('/trend', getPriceTrend);

// Admin routes
router.get('/stats', protect, admin, getPricingStats);
router.post('/update/:flightId', protect, admin, updateFlightPrice);
router.post('/update-all', protect, admin, updateAllPrices);

export default router;
