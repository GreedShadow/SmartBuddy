import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { dashboardAnalytics } from '../controllers/academic.controller.js';
const router = Router();
router.get('/', authenticate, asyncHandler(dashboardAnalytics));
export default router;
