import { ProductService } from '../services/productService.js';
import { deleteImage } from '../config/cloudinary.js';

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

            // Si se subió una imagen, agregar la URL
            if (req.file) {
                req.body.image_url = req.file.path;
                req.body.image_public_id = req.file.filename; // Para poder eliminarla después
            }

            const product = await productService.createProduct(req.body);
            res.status(201).json({ success: true, data: product });
        } catch (error) {
            // Si hay error y se subió una imagen, eliminarla de Cloudinary
            if (req.file) {
                try {
                    await deleteImage(req.file.filename);
                } catch (deleteError) {
                    console.error('Error al eliminar imagen después de error:', deleteError);
                }
            }
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

            let oldImagePublicId = null;

            // Si se subió una nueva imagen
            if (req.file) {
                // Guardar el ID de la imagen anterior para eliminarla después
                if (product.image_public_id) {
                    oldImagePublicId = product.image_public_id;
                }

                req.body.image_url = req.file.path;
                req.body.image_public_id = req.file.filename;
            }

            const updatedProduct = await productService.updateProduct(req.params.id, req.body);

            // Si se actualizó la imagen exitosamente, eliminar la anterior
            if (oldImagePublicId && req.file) {
                try {
                    await deleteImage(oldImagePublicId);
                } catch (deleteError) {
                    console.error('Error al eliminar imagen anterior:', deleteError);
                    // No fallar la actualización por este error
                }
            }

            res.json({ success: true, data: updatedProduct });
        } catch (error) {
            // Si hay error y se subió una nueva imagen, eliminarla
            if (req.file) {
                try {
                    await deleteImage(req.file.filename);
                } catch (deleteError) {
                    console.error('Error al eliminar imagen después de error:', deleteError);
                }
            }
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

            // Eliminar la imagen de Cloudinary si existe
            if (deletedProduct.image_public_id) {
                try {
                    await deleteImage(deletedProduct.image_public_id);
                } catch (deleteError) {
                    console.error('Error al eliminar imagen:', deleteError);
                    // No fallar la eliminación del producto por este error
                }
            }

            res.json({ success: true, data: deletedProduct });
        } catch (error) {
            next(error);
        }
    }
}