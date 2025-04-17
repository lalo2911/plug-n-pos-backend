import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();
const orderController = new OrderController();

router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrder);
router.put('/:id', protect, orderController.updateOrder);
router.delete('/:id', protect, orderController.deleteOrder);

export default router;