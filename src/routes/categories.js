import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';

const router = Router();
const categoryController = new CategoryController();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', categoryController.createCategory);

export default router;