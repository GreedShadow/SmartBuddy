import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createComment, listComments } from '../controllers/academic.controller.js';
const router = Router();
router.get('/', authenticate, asyncHandler(listComments));
router.post('/', authenticate, authorize('admin', 'teacher'), asyncHandler(createComment));
export default router;
