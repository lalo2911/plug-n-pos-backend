import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { protect, isOwner } from '../middlewares/authMiddleware.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const userController = new UserController();

router.post('/', writeLimiter, userController.createUser);
router.get('/', protect, userController.getUsers);

// Obtener empleados por negocio
router.get('/business', protect, isOwner, userController.getEmployeesByBusiness);

router.get('/:id', protect, userController.getUser);
router.put('/:id', protect, writeLimiter, userController.updateUser);
router.delete('/:id', protect, writeLimiter, userController.deleteUser);

// Setup inicial del usuario
router.post('/setup', protect, writeLimiter, userController.completeSetup);

// Unirse a un negocio con código de invitación
router.post('/join-business', protect, writeLimiter, userController.joinBusinessWithCode);

export default router;