import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';
import { protect, isOwner, isAllowedUser } from '../middlewares/authMiddleware.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const orderController = new OrderController();

router.post('/', protect, isAllowedUser, writeLimiter, orderController.createOrder);
router.get('/', protect, isAllowedUser, orderController.getOrders);
router.get('/:id', protect, isAllowedUser, orderController.getOrder);
router.put('/:id', protect, isAllowedUser, writeLimiter, orderController.updateOrder);
router.delete('/:id', protect, isOwner, writeLimiter, orderController.deleteOrder);

export default router;