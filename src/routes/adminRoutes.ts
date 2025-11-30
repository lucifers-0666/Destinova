import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getRevenueReport,
  getRefundRequests,
  processRefundRequest,
  getOccupancyReport,
  exportData,
  getAnalytics,
  getRealtimeStats
} from '../controllers/adminController.js';
import { verifyToken } from '../middleware/auth.js';
import { verifyAdmin, rateLimit } from '../middleware/authorize.js';
import { validatePagination, validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(verifyAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Analytics
router.get('/analytics', getAnalytics);
router.get('/stats/realtime', getRealtimeStats);

// User management
router.get('/users', validatePagination, getAllUsers);
router.get('/users/:id', validateMongoId('id'), getUserById);
router.put('/users/:id/status', validateMongoId('id'), updateUserStatus);

// Reports
router.get('/reports/revenue', getRevenueReport);
router.get('/reports/occupancy', getOccupancyReport);

// Refund management
router.get('/refunds', validatePagination, getRefundRequests);
router.put(
  '/refunds/:bookingId',
  validateMongoId('bookingId'),
  rateLimit(20, 60 * 60 * 1000), // 20 refund actions per hour
  processRefundRequest
);

// Data export
router.get(
  '/export/:type',
  rateLimit(5, 60 * 60 * 1000), // 5 exports per hour
  exportData
);

export default router;
