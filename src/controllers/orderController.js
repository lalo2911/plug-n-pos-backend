import { OrderService } from '../services/orderService.js';

const orderService = new OrderService();

export class OrderController {
    async getOrders(req, res, next) {
        try {
            const orders = await orderService.getAllOrders();
            res.json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    }

    async getOrder(req, res, next) {
        try {
            const order = await orderService.getOrderById(req.params.id);
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async createOrder(req, res, next) {
        try {
            const order = await orderService.createOrder(req.body);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async updateOrder(req, res, next) {
        try {
            const order = await orderService.updateOrder(req.params.id, req.body);
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async deleteOrder(req, res, next) {
        try {
            const order = await orderService.deleteOrder(req.params.id);
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }
}