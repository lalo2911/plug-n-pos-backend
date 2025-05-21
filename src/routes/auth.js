import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { protect, isAllowedUser } from '../middlewares/authMiddleware.js';
import { authLimiter, writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const authController = new AuthController();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/profile', protect, isAllowedUser, authController.getProfile);
router.put('/profile', protect, isAllowedUser, writeLimiter, authController.updateProfile);

// Google OAuth routes
router.get('/google', authLimiter, authController.googleAuth);
router.get('/google/callback', authLimiter, authController.googleAuthCallback);

export default router;