import { ProductService } from '../services/productService.js';

const productService = new ProductService();

export class ProductController {
    async getProducts(req, res, next) {
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

            const products = await productService.getProductsByBusiness(businessId);
            res.json({ success: true, data: products });
        } catch (error) {
            next(error);
        }
    }

    async getProduct(req, res, next) {
        try {
            const product = await productService.getProductById(req.params.id);

            // Verificar que el producto pertenezca al negocio del usuario
            if (product.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para acceder a este producto'
                });
            }

            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async createProduct(req, res, next) {
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

            const product = await productService.createProduct(req.body);
            res.status(201).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const product = await productService.getProductById(req.params.id);

            // Verificar que el producto pertenezca al negocio del usuario
            if (product.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar este producto'
                });
            }

            const updatedProduct = await productService.updateProduct(req.params.id, req.body);
            res.json({ success: true, data: updatedProduct });
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const product = await productService.getProductById(req.params.id);

            // Verificar que el producto pertenezca al negocio del usuario
            if (product.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para eliminar este producto'
                });
            }

            const deletedProduct = await productService.deleteProduct(req.params.id);
            res.json({ success: true, data: deletedProduct });
        } catch (error) {
            next(error);
        }
    }
}