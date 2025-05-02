import { OrderService } from '../services/orderService.js';
import { OrderDetailService } from '../services/orderDetailService.js';
import mongoose from 'mongoose';

const orderService = new OrderService();
const orderDetailService = new OrderDetailService();


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
                    message: 'No tienes permiso para acceder a esta orden'
                });
            }

            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async createOrder(req, res, next) {
        // Iniciar sesión de transacción MongoDB
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Extraer datos del request
            const { productos, total, pago_con, cambio } = req.body;
            const userId = req.user._id;
            const businessId = req.user.business;

            // Verificar que el usuario tenga un negocio asociado
            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            // Verificar que se hayan enviado productos
            if (!productos || !Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe incluir al menos un producto en la orden'
                });
            }

            // Crear objeto de orden
            const orderData = {
                user_id: userId,
                total: total,
                payment: pago_con,
                change: cambio,
                business: businessId
            };

            // Crear la orden principal
            const order = await orderService.createOrder(orderData, { session });

            // Crear los detalles de la orden
            const orderDetailsPromises = productos.map(producto => {
                const orderDetailData = {
                    order_id: order._id,
                    product_id: producto.id,
                    quantity: producto.cantidad,
                    subtotal: producto.subtotal,
                    business: businessId
                };

                return orderDetailService.createOrderDetail(orderDetailData, { session });
            });

            // Esperar a que se creen todos los detalles
            const orderDetails = await Promise.all(orderDetailsPromises);

            // Confirmar la transacción
            await session.commitTransaction();
            session.endSession();

            // Enviar respuesta con la orden y sus detalles
            res.status(201).json({
                success: true,
                data: {
                    order,
                    orderDetails
                }
            });
        } catch (error) {
            // Si hay un error, abortar la transacción
            await session.abortTransaction();
            session.endSession();
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
                    message: 'No tienes permiso para modificar esta orden'
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
                    message: 'No tienes permiso para modificar esta orden'
                });
            }

            const deletedOrder = await orderService.deleteOrder(req.params.id);
            res.json({ success: true, data: deletedOrder });
        } catch (error) {
            next(error);
        }
    }
}