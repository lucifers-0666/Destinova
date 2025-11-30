import express from 'express';
import { getHotels, getFeaturedHotels, getHotelById, createHotel } from '../controllers/hotelController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getHotels).post(protect, admin, createHotel);
router.get('/featured', getFeaturedHotels);
router.get('/:id', getHotelById);

export default router;
