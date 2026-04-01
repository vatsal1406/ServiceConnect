import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminProtect } from '../middleware/adminMiddleware.js';
import {
  getAdminStats,
  getUsers,
  getVendors,
  approveVendor,
  rejectVendor,
  createService,
  updateServicePricing
} from '../controllers/adminController.js';

const router = express.Router();

// All routes below are protected and require Admin role
router.use(protect, adminProtect);

router.get('/dashboard', getAdminStats);
router.get('/users', getUsers);
router.get('/vendors', getVendors);
router.put('/vendor/:id/approve', approveVendor);
router.put('/vendor/:id/reject', rejectVendor);
router.post('/service', createService);
router.put('/service/update', updateServicePricing);

export default router;
