import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteAccount,
  getUserBookingStats,
  updateNotificationPreferences,
  addSavedAddress,
  deleteSavedAddress,
  redeemLoyaltyPoints
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import { verifyEmailVerified, rateLimit } from '../middleware/authorize.js';
import { validateProfileUpdate, validateChangePassword } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);
router.delete('/profile', deleteAccount);

// Password management
router.put('/change-password', validateChangePassword, changePassword);

// Profile picture
router.post('/profile-picture', uploadProfilePicture);

// Booking statistics
router.get('/booking-stats', getUserBookingStats);

// Notification preferences
router.put('/notification-preferences', updateNotificationPreferences);

// Saved addresses
router.post('/addresses', addSavedAddress);
router.delete('/addresses/:addressId', deleteSavedAddress);

// Loyalty points
router.post(
  '/redeem-points',
  verifyEmailVerified,
  rateLimit(5, 60 * 60 * 1000), // 5 redemptions per hour
  redeemLoyaltyPoints
);

export default router;
