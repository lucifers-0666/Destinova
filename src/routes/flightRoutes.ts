import { Router } from 'express';
import {
  searchFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
  getFlightStatus,
  getPopularRoutes,
  getAllFlights,
  updatePricesBulk
} from '../controllers/flightController.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';
import { verifyAdmin } from '../middleware/authorize.js';
import {
  validateFlightSearch,
  validateCreateFlight,
  validateMongoId,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation.js';

const router = Router();

/**
 * @route   GET /api/flights/search
 * @desc    Search flights
 * @access  Public
 */
router.get(
  '/search',
  optionalAuth,
  validateFlightSearch,
  validatePagination,
  handleValidationErrors,
  searchFlights
);

/**
 * @route   GET /api/flights/popular
 * @desc    Get popular routes
 * @access  Public
 */
router.get('/popular', getPopularRoutes);

/**
 * @route   GET /api/flights/status/:flightNumber
 * @desc    Get flight status
 * @access  Public
 */
router.get('/status/:flightNumber', getFlightStatus);

/**
 * @route   GET /api/flights
 * @desc    Get all flights (admin)
 * @access  Private/Admin
 */
router.get(
  '/',
  verifyToken,
  verifyAdmin,
  validatePagination,
  handleValidationErrors,
  getAllFlights
);

/**
 * @route   GET /api/flights/:id
 * @desc    Get flight by ID
 * @access  Public
 */
router.get(
  '/:id',
  validateMongoId('id'),
  handleValidationErrors,
  getFlightById
);

/**
 * @route   POST /api/flights
 * @desc    Create new flight
 * @access  Private/Admin
 */
router.post(
  '/',
  verifyToken,
  verifyAdmin,
  validateCreateFlight,
  handleValidationErrors,
  createFlight
);

/**
 * @route   PUT /api/flights/prices/bulk
 * @desc    Bulk update flight prices
 * @access  Private/Admin
 */
router.put(
  '/prices/bulk',
  verifyToken,
  verifyAdmin,
  updatePricesBulk
);

/**
 * @route   PUT /api/flights/:id
 * @desc    Update flight
 * @access  Private/Admin
 */
router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  validateMongoId('id'),
  handleValidationErrors,
  updateFlight
);

/**
 * @route   DELETE /api/flights/:id
 * @desc    Delete/Cancel flight
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  validateMongoId('id'),
  handleValidationErrors,
  deleteFlight
);

export default router;
