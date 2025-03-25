import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please add a user']
    },
    total: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a price'],
        min: 0
    },
    payment: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a payment'],
        min: 0
    },
    change: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a change'],
        min: 0
    }
}, {
    timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);