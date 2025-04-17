import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { protect, isOwner } from '../middlewares/authMiddleware.js';

const router = Router();
const userController = new UserController();

router.post('/', userController.createUser);
router.get('/', protect, userController.getUsers);
router.get('/:id', protect, userController.getUser);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

// Setup inicial del usuario
router.post('/setup', protect, userController.completeSetup);

// Unirse a un negocio con código de invitación
router.post('/join-business', protect, userController.joinBusinessWithCode);

// Obtener usuarios por negocio
router.get('/business/:businessId', protect, isOwner, userController.getUsersByBusiness);

export default router;