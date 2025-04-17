import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();
const productController = new ProductController();

router.post('/', protect, productController.createProduct);
router.get('/', protect, productController.getProducts);
router.get('/:id', protect, productController.getProduct);
router.put('/:id', protect, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

export default router;