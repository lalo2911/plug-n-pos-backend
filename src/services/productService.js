import { Product } from '../models/productModel.js';

export class ProductService {
    async getAllProducts() {
        return await Product.find();
    }

    async getProductById(id) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(productData) {
        return await Product.create(productData);
    }

    async updateProduct(id, productData) {
        const product = await Product.findByIdAndUpdate(
            id,
            productData,
            { new: true, runValidators: true }
        );
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async deleteProduct(id) {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
}