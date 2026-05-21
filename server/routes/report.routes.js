import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { buildReport } from '../controllers/academic.controller.js';
const router = Router();
router.get('/:studentId', authenticate, asyncHandler(buildReport));
export default router;
