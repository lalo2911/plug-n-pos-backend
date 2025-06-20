import { Router } from 'express';
import { BusinessController } from '../controllers/businessController.js';
import { protect, isOwner } from '../middlewares/authMiddleware.js';
import { validateBusiness, validateBusinessId } from '../validators/businessValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const businessController = new BusinessController();

// Rutas para el negocio
router.post('/', protect, isOwner, writeLimiter, validateBusiness, validateRequest, businessController.createBusiness);
router.get('/me', protect, businessController.getCurrentUserBusiness);
router.get('/:id', protect, validateBusinessId, validateRequest, businessController.getBusiness);
router.put('/:id', protect, isOwner, writeLimiter, validateBusinessId, validateBusiness, validateRequest, businessController.updateBusiness);

// Rutas para códigos de invitación
router.post('/invite-code', protect, isOwner, writeLimiter, businessController.generateInviteCode);
router.get('/employees', protect, isOwner, businessController.getBusinessEmployees);

export default router;