import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { protect, isOwner, isAllowedUser } from '../middlewares/authMiddleware.js';

const router = Router();
const productController = new ProductController();

router.post('/', protect, isOwner, productController.createProduct);
router.get('/', protect, isAllowedUser, productController.getProducts);
router.get('/:id', protect, isAllowedUser, productController.getProduct);
router.put('/:id', protect, isOwner, productController.updateProduct);
router.delete('/:id', protect, isOwner, productController.deleteProduct);

export default router;