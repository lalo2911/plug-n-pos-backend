import { CategoryService } from '../services/categoryService.js';

const categoryService = new CategoryService();

export class CategoryController {
    async getCategories(req, res, next) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json({ success: true, data: categories });
        } catch (error) {
            next(error);
        }
    }

    async getCategory(req, res, next) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            res.json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    }

    async createCategory(req, res, next) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            res.json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const category = await categoryService.deleteCategory(req.params.id);
            res.json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    }
}