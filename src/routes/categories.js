import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();
const categoryController = new CategoryController();

router.post('/', protect, categoryController.createCategory);
router.get('/', protect, categoryController.getCategories);
router.get('/:id', protect, categoryController.getCategory);
router.put('/:id', protect, categoryController.updateCategory);
router.delete('/:id', protect, categoryController.deleteCategory);

export default router;