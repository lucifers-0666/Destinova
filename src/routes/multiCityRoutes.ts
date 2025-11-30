/**
 * Multi-City Booking Routes
 */

import express from 'express';
import {
  createMultiCityBooking,
  getMultiCityBooking,
  searchMultiCityFlights,
  calculateMultiCityPrice
} from '../controllers/multiCityController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search flights for multi-city
router.post('/flights/search/multi-city', searchMultiCityFlights);

// Calculate multi-city pricing
router.post('/bookings/multi-city/calculate', calculateMultiCityPrice);

// Create multi-city booking
router.post('/bookings/multi-city', optionalAuth, createMultiCityBooking);

// Get multi-city booking details
router.get('/bookings/multi-city/:id', optionalAuth, getMultiCityBooking);

export default router;
