import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { deleteAttendance, listAttendance, saveAttendance } from '../controllers/academic.controller.js';
const router = Router();
router.get('/', authenticate, asyncHandler(listAttendance));
router.post('/', authenticate, authorize('admin', 'teacher'), asyncHandler(saveAttendance));
router.delete('/:id', authenticate, authorize('admin', 'teacher'), asyncHandler(deleteAttendance));
export default router;
