import { Router } from 'express';
import { OrderDetailController } from '../controllers/orderDetailController.js';
import { protect, isOwner, isAllowedUser } from '../middlewares/authMiddleware.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const orderDetailController = new OrderDetailController();

router.post('/', protect, isAllowedUser, writeLimiter, orderDetailController.createOrderDetail);
router.get('/', protect, isAllowedUser, orderDetailController.getOrderDetails);
router.get('/:id', protect, isAllowedUser, orderDetailController.getOrderDetail);
router.put('/:id', protect, isAllowedUser, writeLimiter, orderDetailController.updateOrderDetail);
router.delete('/:id', protect, isOwner, writeLimiter, orderDetailController.deleteOrderDetail);

// Obtener todos los detalles de ordenes (productos) de una orden especifica
router.get('/order/:id', protect, isAllowedUser, orderDetailController.getOrderDetailsByOrder);

export default router;