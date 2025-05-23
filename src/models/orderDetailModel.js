import mongoose from 'mongoose';

const orderDetailSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: [true, 'Please add an order']
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Please add a product']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add a quantity'],
        min: [0, 'Quantity must be at least 0'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer'
        }
    },
    subtotal: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a subtotal'],
        min: 0
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    }
}, {
    timestamps: true
});

export const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);