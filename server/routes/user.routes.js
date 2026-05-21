import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { listUsers } from '../controllers/core.controller.js';
const router = Router();
router.get('/', authenticate, authorize('admin'), asyncHandler(listUsers));
export default router;
