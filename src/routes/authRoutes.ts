import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  logout,
  getMe
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors
} from '../middleware/validation.js';
import { rateLimit } from '../middleware/authorize.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  rateLimit(5, 60 * 60 * 1000), // 5 registrations per hour per IP
  validateRegistration,
  handleValidationErrors,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  rateLimit(10, 15 * 60 * 1000), // 10 login attempts per 15 min
  validateLogin,
  handleValidationErrors,
  login
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  rateLimit(3, 60 * 60 * 1000), // 3 requests per hour
  validateForgotPassword,
  handleValidationErrors,
  forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  rateLimit(5, 60 * 60 * 1000), // 5 attempts per hour
  validateResetPassword,
  handleValidationErrors,
  resetPassword
);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Public (with refresh token)
 */
router.post(
  '/refresh-token',
  rateLimit(20, 60 * 60 * 1000), // 20 refreshes per hour
  refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', verifyToken, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', verifyToken, getMe);

export default router;
