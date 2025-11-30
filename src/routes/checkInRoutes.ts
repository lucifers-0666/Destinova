/**
 * Check-In Routes
 * Handles check-in and boarding pass operations
 */

import express from 'express';
import {
  searchBookingForCheckIn,
  performCheckIn,
  getBoardingPass,
  emailBoardingPass,
  getCheckInStatus
} from '../controllers/checkInController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (require booking reference + last name)
router.post('/search', searchBookingForCheckIn);

// Authenticated routes  
router.post('/bookings/:id/check-in', optionalAuth, performCheckIn);
router.get('/bookings/:id/boarding-pass', optionalAuth, getBoardingPass);
router.post('/bookings/:id/boarding-pass/email', optionalAuth, emailBoardingPass);
router.get('/bookings/:id/check-in/status', optionalAuth, getCheckInStatus);

export default router;
