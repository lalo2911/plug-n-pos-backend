import { Category } from '../models/categoryModel.js';

export class CategoryService {
    async getAllCategories() {
        return await Category.find();
    }

    async getCategoriesByBusiness(businessId) {
        return await Category.find({ business: businessId });
    }

    async getCategoryById(id) {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async createCategory(categoryData) {
        return await Category.create(categoryData);
    }

    async updateCategory(id, categoryData) {
        const category = await Category.findByIdAndUpdate(
            id,
            categoryData,
            { new: true, runValidators: true }
        );
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async deleteCategory(id) {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }
}