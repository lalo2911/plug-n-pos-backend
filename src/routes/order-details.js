import { Router } from 'express';
import { OrderDetailController } from '../controllers/orderDetailController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();
const orderDetailController = new OrderDetailController();

router.post('/', protect, orderDetailController.createOrderDetail);
router.get('/', protect, orderDetailController.getOrderDetails);
router.get('/:id', protect, orderDetailController.getOrderDetail);
router.put('/:id', protect, orderDetailController.updateOrderDetail);
router.delete('/:id', protect, orderDetailController.deleteOrderDetail);

export default router;