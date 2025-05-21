import { Router } from 'express';
import { BusinessController } from '../controllers/businessController.js';
import { protect, isOwner } from '../middlewares/authMiddleware.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const businessController = new BusinessController();

// Rutas para el negocio
router.post('/', protect, isOwner, writeLimiter, businessController.createBusiness);
router.get('/me', protect, businessController.getCurrentUserBusiness);
router.get('/:id', protect, businessController.getBusiness);
router.put('/:id', protect, isOwner, writeLimiter, businessController.updateBusiness);

// Rutas para códigos de invitación
router.post('/invite-code', protect, isOwner, writeLimiter, businessController.generateInviteCode);
router.get('/employees', protect, isOwner, businessController.getBusinessEmployees);

export default router;