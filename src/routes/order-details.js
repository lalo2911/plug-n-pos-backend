import { Router } from 'express';
import { OrderDetailController } from '../controllers/orderDetailController.js';
import { protect, isOwner, isAllowedUser } from '../middlewares/authMiddleware.js';

const router = Router();
const orderDetailController = new OrderDetailController();

router.post('/', protect, isAllowedUser, orderDetailController.createOrderDetail);
router.get('/', protect, isAllowedUser, orderDetailController.getOrderDetails);
router.get('/:id', protect, isAllowedUser, orderDetailController.getOrderDetail);
router.put('/:id', protect, isAllowedUser, orderDetailController.updateOrderDetail);
router.delete('/:id', protect, isOwner, orderDetailController.deleteOrderDetail);

export default router;