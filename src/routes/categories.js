import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { protect, isOwner, isAllowedUser } from '../middlewares/authMiddleware.js';
import { validateCategory, validateCategoryId } from '../validators/categoryValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const categoryController = new CategoryController();

router.post('/', protect, isOwner, writeLimiter, validateCategory, validateRequest, categoryController.createCategory);
router.get('/', protect, isAllowedUser, categoryController.getCategories);
router.get('/:id', protect, isAllowedUser, validateCategoryId, validateRequest, categoryController.getCategory);
router.put('/:id', protect, isOwner, writeLimiter, validateCategoryId, validateCategory, validateRequest, categoryController.updateCategory);
router.delete('/:id', protect, isOwner, writeLimiter, validateCategoryId, validateRequest, categoryController.deleteCategory);

export default router;