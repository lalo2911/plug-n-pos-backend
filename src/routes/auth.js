import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { protect, isAllowedUser } from '../middlewares/authMiddleware.js';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', protect, isAllowedUser, authController.getProfile);
router.put('/profile', protect, isAllowedUser, authController.updateProfile);

// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

export default router;