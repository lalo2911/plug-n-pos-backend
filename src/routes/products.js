import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';

const router = Router();
const productController = new ProductController();

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;