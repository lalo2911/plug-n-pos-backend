import { OrderDetailService } from '../services/orderDetailService.js';

const orderDetailService = new OrderDetailService();

export class OrderDetailController {
    async getOrderDetails(req, res, next) {
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

            const orderDetails = await orderDetailService.getOrderDetailsByBusiness(businessId);
            res.json({ success: true, data: orderDetails });
        } catch (error) {
            next(error);
        }
    }

    async getOrderDetail(req, res, next) {
        try {
            const orderDetail = await orderDetailService.getOrderDetailById(req.params.id);

            // Verificar que el detalle de orden pertenezca al negocio del usuario
            if (orderDetail.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para acceder a esta categoría'
                });
            }

            res.json({ success: true, data: orderDetail });
        } catch (error) {
            next(error);
        }
    }

    async createOrderDetail(req, res, next) {
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

            const orderDetail = await orderDetailService.createOrderDetail(req.body);
            res.status(201).json({ success: true, data: orderDetail });
        } catch (error) {
            next(error);
        }
    }

    async updateOrderDetail(req, res, next) {
        try {
            const orderDetail = await orderDetailService.getOrderDetailById(req.params.id);

            // Verificar que el detalle de orden pertenezca al negocio del usuario
            if (orderDetail.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar esta categoría'
                });
            }

            const updatedOrderDetail = await orderDetailService.updateOrderDetail(req.params.id, req.body);
            res.json({ success: true, data: updatedOrderDetail });
        } catch (error) {
            next(error);
        }
    }

    async deleteOrderDetail(req, res, next) {
        try {
            const orderDetail = await orderDetailService.getOrderDetailById(req.params.id);

            // Verificar que el detalle de orden pertenezca al negocio del usuario
            if (orderDetail.business.toString() !== req.user.business.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para modificar esta categoría'
                });
            }

            const deletedDetail = await orderDetailService.deleteOrderDetail(req.params.id);
            res.json({ success: true, data: deletedDetail });
        } catch (error) {
            next(error);
        }
    }
}