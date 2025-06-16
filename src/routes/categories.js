import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { protect, isOwner, isAllowedUser } from '../middlewares/authMiddleware.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const categoryController = new CategoryController();

router.post('/', protect, isOwner, writeLimiter, categoryController.createCategory);
router.get('/', protect, isAllowedUser, categoryController.getCategories);
router.get('/:id', protect, isAllowedUser, categoryController.getCategory);
router.put('/:id', protect, isOwner, writeLimiter, categoryController.updateCategory);
router.delete('/:id', protect, isOwner, writeLimiter, categoryController.deleteCategory);

export default router;