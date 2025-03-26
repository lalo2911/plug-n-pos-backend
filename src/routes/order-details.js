import { Router } from 'express';
import { OrderDetailController } from '../controllers/orderDetailController.js';

const router = Router();
const orderDetailController = new OrderDetailController();

router.post('/', orderDetailController.createOrderDetail);
router.get('/', orderDetailController.getOrderDetails);
router.get('/:id', orderDetailController.getOrderDetail);
router.put('/:id', orderDetailController.updateOrderDetail);
router.delete('/:id', orderDetailController.deleteOrderDetail);

export default router;