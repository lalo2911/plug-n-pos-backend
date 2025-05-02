import { OrderDetail } from '../models/orderDetailModel.js';

export class OrderDetailService {
    async getAllOrderDetails() {
        return await OrderDetail.find();
    }

    async getOrderDetailsByBusiness(businessId) {
        return await OrderDetail.find({ business: businessId });
    }

    async getOrderDetailsByOrderId(orderId) {
        return await OrderDetail.find({ order_id: orderId });
    }

    async getOrderDetailById(id) {
        const orderDetail = await OrderDetail.findById(id);
        if (!orderDetail) {
            throw new Error('OrderDetail not found');
        }
        return orderDetail;
    }

    async createOrderDetail(orderDetailData, options = {}) {
        return await OrderDetail.create([orderDetailData], options).then(details => details[0]);
    }

    async updateOrderDetail(id, orderDetailData) {
        const orderDetail = await OrderDetail.findByIdAndUpdate(
            id,
            orderDetailData,
            { new: true, runValidators: true }
        );
        if (!orderDetail) {
            throw new Error('OrderDetail not found');
        }
        return orderDetail;
    }

    async deleteOrderDetail(id) {
        const orderDetail = await OrderDetail.findByIdAndDelete(id);
        if (!orderDetail) {
            throw new Error('OrderDetail not found');
        }
        return orderDetail;
    }
}