/**
 * Seat Routes
 * API endpoints for seat selection and management
 */

import { Router } from 'express';
import {
  getSeatMap,
  lockSeats,
  releaseSeats,
  bookSeats,
  getMyLockedSeats
} from '../controllers/seatController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes (seat map viewing)
router.get('/:id/seats', getSeatMap);

// Protected routes (seat operations)
router.post('/:id/seats/lock', optionalAuth, lockSeats);
router.post('/:id/seats/release', optionalAuth, releaseSeats);
router.post('/:id/seats/book', protect, bookSeats);
router.get('/:id/seats/my-locks', optionalAuth, getMyLockedSeats);

export default router;
