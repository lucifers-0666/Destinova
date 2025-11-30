/**
 * Refund Routes
 * Routes for refund management
 */

import express from 'express';
import {
  requestRefund,
  getRefundStatus,
  getMyRefunds,
  getAllRefunds,
  reviewRefund,
  approveRefund,
  rejectRefund,
  processRefund,
  getRefundStats
} from '../controllers/refundController.js';
import { authenticate } from '../middleware/auth.js';
import { verifyAdmin, rateLimit } from '../middleware/authorize.js';
import { validatePagination } from '../middleware/validation.js';

const router = express.Router();

// User routes (authenticated)
router.post('/request', authenticate, rateLimit(5, 60 * 60 * 1000), requestRefund);
router.get('/my-refunds', authenticate, validatePagination, getMyRefunds);
router.get('/:refundId', authenticate, getRefundStatus);

// Admin routes
router.get(
  '/admin/list',
  authenticate,
  verifyAdmin,
  validatePagination,
  getAllRefunds
);

router.get(
  '/admin/stats',
  authenticate,
  verifyAdmin,
  getRefundStats
);

router.put(
  '/admin/:refundId/review',
  authenticate,
  verifyAdmin,
  reviewRefund
);

router.put(
  '/admin/:refundId/approve',
  authenticate,
  verifyAdmin,
  approveRefund
);

router.put(
  '/admin/:refundId/reject',
  authenticate,
  verifyAdmin,
  rejectRefund
);

router.put(
  '/admin/:refundId/process',
  authenticate,
  verifyAdmin,
  processRefund
);

export default router;
