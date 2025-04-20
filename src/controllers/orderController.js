import { OrderService } from '../services/orderService.js';

const orderService = new OrderService();

export class OrderController {
    async getOrders(req, res, next) {
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

            const orders = await orderService.getOrdersByBusiness(businessId);
            res.json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    }

    async getOrder(req, res, next) {
        try {
            const order = await orderService.getOrderById(req.params.id);

            // Verificar que la orden pertenezca al negocio del usuario
            if (order.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para acceder a esta categoría'
                });
            }

            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async createOrder(req, res, next) {
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

            const order = await orderService.createOrder(req.body);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async updateOrder(req, res, next) {
        try {
            const order = await orderService.getOrderById(req.params.id);

            // Verificar que la orden pertenezca al negocio del usuario
            if (order.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar esta categoría'
                });
            }

            const updatedOrder = await orderService.updateOrder(req.params.id, req.body);
            res.json({ success: true, data: updatedOrder });
        } catch (error) {
            next(error);
        }
    }

    async deleteOrder(req, res, next) {
        try {
            const order = await orderService.getOrderById(req.params.id);

            // Verificar que la orden pertenezca al negocio del usuario
            if (order.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar esta categoría'
                });
            }

            const deletedOrder = await orderService.deleteOrder(req.params.id);
            res.json({ success: true, data: deletedOrder });
        } catch (error) {
            next(error);
        }
    }
}