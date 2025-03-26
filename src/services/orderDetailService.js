import { OrderDetail } from '../models/orderDetailModel.js';

export class OrderDetailService {
    async getAllOrderDetails() {
        return await OrderDetail.find();
    }

    async getOrderDetailById(id) {
        const orderDetail = await OrderDetail.findById(id);
        if (!orderDetail) {
            throw new Error('OrderDetail not found');
        }
        return orderDetail;
    }

    async createOrderDetail(orderDetailData) {
        return await OrderDetail.create(orderDetailData);
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