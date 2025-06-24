import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { protect, isAllowedUser } from '../middlewares/authMiddleware.js';
import { validateRegister, validateLogin, validateUpdateProfile, validateExchangeCode } from '../validators/authValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { authLimiter, writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const authController = new AuthController();

router.post('/register', authLimiter, validateRegister, validateRequest, authController.register);
router.post('/login', authLimiter, validateLogin, validateRequest, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', protect, authController.logout);
router.post('/logout-all', protect, authController.logoutAllDevices);
router.post('/exchange-code', authLimiter, validateExchangeCode, validateRequest, authController.exchangeAuthCode);
router.get('/profile', protect, isAllowedUser, authController.getProfile);
router.put('/profile', protect, isAllowedUser, writeLimiter, validateUpdateProfile, validateRequest, authController.updateProfile);

// Google OAuth routes
router.get('/google', authLimiter, authController.googleAuth);
router.get('/google/callback', authLimiter, authController.googleAuthCallback);

export default router;