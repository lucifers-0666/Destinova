import express from 'express';
import {
  createPriceAlert,
  getMyAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
  checkAlerts,
  getPriceHistory,
  getAlertSuggestions,
  getAllAlerts
} from '../controllers/priceAlertController.js';
import { verifyToken } from '../middleware/auth.js';
import { verifyAdmin, verifyEmailVerified, rateLimit } from '../middleware/authorize.js';
import { validatePriceAlert, validateMongoId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/price-history', getPriceHistory);

// Protected routes (require authentication)
router.post(
  '/',
  verifyToken,
  verifyEmailVerified,
  validatePriceAlert,
  rateLimit(20, 24 * 60 * 60 * 1000), // 20 alert creations per day
  createPriceAlert
);

router.get('/my', verifyToken, validatePagination, getMyAlerts);
router.get('/suggestions', verifyToken, getAlertSuggestions);
router.get('/:id', verifyToken, validateMongoId('id'), getAlertById);
router.put('/:id', verifyToken, validateMongoId('id'), updateAlert);
router.delete('/:id', verifyToken, validateMongoId('id'), deleteAlert);

// Admin/System routes
router.post(
  '/check',
  verifyToken,
  verifyAdmin,
  checkAlerts
);

router.get(
  '/admin/all',
  verifyToken,
  verifyAdmin,
  validatePagination,
  getAllAlerts
);

export default router;
