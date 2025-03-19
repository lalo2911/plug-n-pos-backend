import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', productController.createProduct);

export default router;