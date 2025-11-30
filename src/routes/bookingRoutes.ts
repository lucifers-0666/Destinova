import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getBookingStats,
  getBookingByReference
} from '../controllers/bookingController.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';
import { verifyAdmin } from '../middleware/authorize.js';
import {
  validateCreateBooking,
  validateMongoId,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation.js';

const router = Router();

/**
 * @route   GET /api/bookings/stats
 * @desc    Get booking statistics
 * @access  Private/Admin
 */
router.get(
  '/stats',
  verifyToken,
  verifyAdmin,
  getBookingStats
);

/**
 * @route   GET /api/bookings/my
 * @desc    Get current user's bookings
 * @access  Private
 */
router.get(
  '/my',
  verifyToken,
  validatePagination,
  handleValidationErrors,
  getMyBookings
);

/**
 * @route   GET /api/bookings/reference/:ref
 * @desc    Get booking by reference number
 * @access  Public (with email) / Private
 */
router.get(
  '/reference/:ref',
  optionalAuth,
  getBookingByReference
);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings
 * @access  Private/Admin
 */
router.get(
  '/',
  verifyToken,
  verifyAdmin,
  validatePagination,
  handleValidationErrors,
  getAllBookings
);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private
 */
router.get(
  '/:id',
  verifyToken,
  validateMongoId('id'),
  handleValidationErrors,
  getBookingById
);

/**
 * @route   POST /api/bookings
 * @desc    Create new booking
 * @access  Private
 */
router.post(
  '/',
  verifyToken,
  validateCreateBooking,
  handleValidationErrors,
  createBooking
);

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private
 */
router.put(
  '/:id/cancel',
  verifyToken,
  validateMongoId('id'),
  handleValidationErrors,
  cancelBooking
);

export default router;
