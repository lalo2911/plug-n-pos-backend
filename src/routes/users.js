import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();
const userController = new UserController();

router.post('/', userController.createUser);
router.get('/', protect, userController.getUsers);
router.get('/:id', protect, userController.getUser);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

router.post('/setup', protect, userController.completeSetup);

export default router;