import { OrderDetailService } from '../services/orderDetailService.js';

const orderDetailService = new OrderDetailService();

export class OrderDetailController {
    async getOrderDetails(req, res, next) {
        try {
            const orderDetails = await orderDetailService.getAllOrderDetails();
            res.json({ success: true, data: orderDetails });
        } catch (error) {
            next(error);
        }
    }

    async getOrderDetail(req, res, next) {
        try {
            const orderDetail = await orderDetailService.getOrderDetailById(req.params.id);
            res.json({ success: true, data: orderDetail });
        } catch (error) {
            next(error);
        }
    }

    async createOrderDetail(req, res, next) {
        try {
            const orderDetail = await orderDetailService.createOrderDetail(req.body);
            res.status(201).json({ success: true, data: orderDetail });
        } catch (error) {
            next(error);
        }
    }

    async updateOrderDetail(req, res, next) {
        try {
            const orderDetail = await orderDetailService.updateOrderDetail(req.params.id, req.body);
            res.json({ success: true, data: orderDetail });
        } catch (error) {
            next(error);
        }
    }

    async deleteOrderDetail(req, res, next) {
        try {
            const orderDetail = await orderDetailService.deleteOrderDetail(req.params.id);
            res.json({ success: true, data: orderDetail });
        } catch (error) {
            next(error);
        }
    }
}