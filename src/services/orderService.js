import { Order } from '../models/orderModel.js';

export class OrderService {
    async getAllOrders() {
        return await Order.find();
    }

    async getOrdersByBusiness(businessId) {
        return await Order.find({ business: businessId });
    }

    async getOrderById(id) {
        const order = await Order.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async createOrder(orderData, options = {}) {
        return await Order.create([orderData], options).then(orders => orders[0]);
    }

    async updateOrder(id, orderData) {
        const order = await Order.findByIdAndUpdate(
            id,
            orderData,
            { new: true, runValidators: true }
        );
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async deleteOrder(id) {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }
}