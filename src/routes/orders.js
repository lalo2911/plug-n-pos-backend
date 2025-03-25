import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';

const router = Router();
const orderController = new OrderController();

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

export default router;