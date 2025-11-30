/**
 * Insurance Routes
 * API routes for travel insurance
 */

import express from 'express';
import {
  getInsurancePlans,
  getInsurancePlan,
  calculatePremium,
  comparePlans,
  createInsurancePlan,
  updateInsurancePlan,
  deleteInsurancePlan
} from '../controllers/insuranceController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/plans', getInsurancePlans);
router.get('/plans/:id', getInsurancePlan);
router.post('/calculate', calculatePremium);
router.get('/compare', comparePlans);

// Admin routes
router.post('/', authenticateToken, isAdmin, createInsurancePlan);
router.put('/:id', authenticateToken, isAdmin, updateInsurancePlan);
router.delete('/:id', authenticateToken, isAdmin, deleteInsurancePlan);

export default router;
