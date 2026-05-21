import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { login, me, register } from '../controllers/auth.controller.js';

const router = Router();
router.post('/login', asyncHandler(login));
router.post('/register', authenticate, authorize('admin'), asyncHandler(register));
router.get('/me', authenticate, asyncHandler(me));
export default router;
