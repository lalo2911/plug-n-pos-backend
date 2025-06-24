import { CategoryService } from '../services/categoryService.js';

const categoryService = new CategoryService();

export class CategoryController {
    async getCategories(req, res, next) {
        try {
            // Obtener el negocio del usuario
            const businessId = req.user.business;

            // Verificar que el usuario tenga un negocio asociado
            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const categories = await categoryService.getCategoriesByBusiness(businessId);
            res.json({ success: true, data: categories });
        } catch (error) {
            next(error);
        }
    }

    async getCategory(req, res, next) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);

            // Verificar que la categoría pertenezca al negocio del usuario
            if (category.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para acceder a esta categoría'
                });
            }

            res.json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    }

    async createCategory(req, res, next) {
        try {
            // Agregar el negocio del usuario
            req.body.business = req.user.business;

            // Verificar que el usuario tenga un negocio asociado
            if (!req.body.business) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const category = await categoryService.createCategory(req.body);
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);

            // Verificar que la categoría pertenezca al negocio del usuario
            if (category.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar esta categoría'
                });
            }

            const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
            res.json({ success: true, data: updatedCategory });
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);

            // Verificar que la categoría pertenezca al negocio del usuario
            if (category.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para eliminar esta categoría'
                });
            }

            const deletedCategory = await categoryService.deleteCategory(req.params.id);
            res.json({ success: true, data: deletedCategory });
        } catch (error) {
            next(error);
        }
    }
}