import { ProductService } from '../services/productService.js';

const productService = new ProductService();

export class ProductController {
    async getProducts(req, res, next) {
        try {
            const products = await productService.getAllProducts();
            res.json({ success: true, data: products });
        } catch (error) {
            next(error);
        }
    }

    async getProduct(req, res, next) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async createProduct(req, res, next) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const product = await productService.deleteProduct(req.params.id);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }
}