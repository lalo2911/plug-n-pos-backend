import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { protect, isOwner, isAllowedUser } from '../middlewares/authMiddleware.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';
import { upload } from '../config/cloudinary.js';

const router = Router();
const productController = new ProductController();

router.post('/', protect, isOwner, writeLimiter, upload.single('image'), productController.createProduct);
router.get('/', protect, isAllowedUser, productController.getProducts);
router.get('/:id', protect, isAllowedUser, productController.getProduct);
router.put('/:id', protect, isOwner, writeLimiter, upload.single('image'), productController.updateProduct);
router.delete('/:id', protect, isOwner, writeLimiter, productController.deleteProduct);

export default router;