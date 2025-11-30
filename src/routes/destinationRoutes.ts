import express from 'express';
import {
  getDestinations,
  getFeaturedDestinations,
  getPopularDestinations,
  getDestinationById,
  getDestinationByCode,
  searchDestinations,
  getDestinationsByContinent,
  createDestination,
  updateDestination,
  deleteDestination,
  getDestinationStats
} from '../controllers/destinationController.js';
import { verifyToken } from '../middleware/auth.js';
import { verifyAdmin } from '../middleware/authorize.js';
import { validateMongoId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', validatePagination, getDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/popular', getPopularDestinations);
router.get('/search', searchDestinations);
router.get('/continent/:continent', validatePagination, getDestinationsByContinent);
router.get('/code/:code', getDestinationByCode);
router.get('/:id', validateMongoId('id'), getDestinationById);

// Admin routes
router.post(
  '/',
  verifyToken,
  verifyAdmin,
  createDestination
);

router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  validateMongoId('id'),
  updateDestination
);

router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  validateMongoId('id'),
  deleteDestination
);

router.get(
  '/admin/stats',
  verifyToken,
  verifyAdmin,
  getDestinationStats
);

export default router;
