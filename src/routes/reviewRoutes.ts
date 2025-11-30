import express from 'express';
import {
  createReview,
  getFlightReviews,
  getAirlineReviews,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  voteReview,
  reportReview,
  getAllReviews,
  moderateReview,
  getReviewStats
} from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';
import { verifyAdmin, verifyEmailVerified, rateLimit } from '../middleware/authorize.js';
import { validateCreateReview, validateMongoId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/flight/:flightId', validateMongoId('flightId'), validatePagination, getFlightReviews);
router.get('/airline/:airline', validatePagination, getAirlineReviews);
router.get('/:id', validateMongoId('id'), getReviewById);

// Protected routes (require authentication)
router.post(
  '/',
  verifyToken,
  verifyEmailVerified,
  validateCreateReview,
  rateLimit(10, 24 * 60 * 60 * 1000), // 10 reviews per day
  createReview
);

router.get('/my/reviews', verifyToken, validatePagination, getMyReviews);

router.put(
  '/:id',
  verifyToken,
  validateMongoId('id'),
  validateCreateReview,
  updateReview
);

router.delete(
  '/:id',
  verifyToken,
  validateMongoId('id'),
  deleteReview
);

// Vote on review helpfulness
router.post(
  '/:id/vote',
  verifyToken,
  validateMongoId('id'),
  rateLimit(50, 60 * 60 * 1000), // 50 votes per hour
  voteReview
);

// Report a review
router.post(
  '/:id/report',
  verifyToken,
  validateMongoId('id'),
  rateLimit(10, 60 * 60 * 1000), // 10 reports per hour
  reportReview
);

// Admin routes
router.get(
  '/admin/all',
  verifyToken,
  verifyAdmin,
  validatePagination,
  getAllReviews
);

router.get(
  '/admin/stats',
  verifyToken,
  verifyAdmin,
  getReviewStats
);

router.put(
  '/admin/:id/moderate',
  verifyToken,
  verifyAdmin,
  validateMongoId('id'),
  moderateReview
);

export default router;
