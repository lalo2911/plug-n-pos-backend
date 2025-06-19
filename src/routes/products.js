import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { protect, isOwner, isAllowedUser } from '../middlewares/authMiddleware.js';
import { validateProduct, validateProductId } from '../validators/productValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';
import { upload } from '../config/cloudinary.js';

const router = Router();
const productController = new ProductController();

router.post('/', protect, isOwner, writeLimiter, upload.single('image'), validateProduct, validateRequest, productController.createProduct);
router.get('/', protect, isAllowedUser, productController.getProducts);
router.get('/:id', protect, isAllowedUser, validateProductId, validateRequest, productController.getProduct);
router.put('/:id', protect, isOwner, writeLimiter, upload.single('image'), validateProductId, validateProduct, validateRequest, productController.updateProduct);
router.delete('/:id', protect, isOwner, validateProductId, validateRequest, writeLimiter, productController.deleteProduct);

export default router;