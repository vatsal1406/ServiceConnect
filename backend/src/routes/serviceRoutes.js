import express from 'express';
import { getServices } from '../controllers/serviceController.js';
import { getServiceById } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getServices);        // Show all services
router.get('/:id', getServiceById);

export default router;