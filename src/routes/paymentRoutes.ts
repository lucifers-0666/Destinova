import { Router } from 'express';
import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  processRefund,
  getPaymentHistory,
  stripeWebhook,
  getPaymentById,
  getAllPayments
} from '../controllers/paymentController.js';
import { verifyToken } from '../middleware/auth.js';
import { verifyAdmin } from '../middleware/authorize.js';
import {
  validateCreatePayment,
  validateMongoId,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation.js';

const router = Router();

/**
 * @route   POST /api/payments/webhook
 * @desc    Stripe webhook handler
 * @access  Public (with Stripe signature)
 * Note: This must come BEFORE the express.json() middleware
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

/**
 * @route   POST /api/payments/create-intent
 * @desc    Create Stripe payment intent
 * @access  Private
 */
router.post(
  '/create-intent',
  verifyToken,
  validateCreatePayment,
  handleValidationErrors,
  createPaymentIntent
);

/**
 * @route   POST /api/payments/confirm
 * @desc    Confirm payment
 * @access  Private
 */
router.post(
  '/confirm',
  verifyToken,
  confirmPayment
);

/**
 * @route   POST /api/payments/refund/:bookingId
 * @desc    Process refund
 * @access  Private/Admin
 */
router.post(
  '/refund/:bookingId',
  verifyToken,
  verifyAdmin,
  validateMongoId('bookingId'),
  handleValidationErrors,
  processRefund
);

/**
 * @route   GET /api/payments/history
 * @desc    Get user's payment history
 * @access  Private
 */
router.get(
  '/history',
  verifyToken,
  validatePagination,
  handleValidationErrors,
  getPaymentHistory
);

/**
 * @route   GET /api/payments
 * @desc    Get all payments
 * @access  Private/Admin
 */
router.get(
  '/',
  verifyToken,
  verifyAdmin,
  validatePagination,
  handleValidationErrors,
  getAllPayments
);

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get(
  '/:id',
  verifyToken,
  validateMongoId('id'),
  handleValidationErrors,
  getPaymentById
);

export default router;
