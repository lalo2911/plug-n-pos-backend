import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a price'],
        min: 0
    },
    image_url: {
        type: String,
        default: null
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please add a category']
    }
}, {
    timestamps: true
});

export const Product = mongoose.model('Product', productSchema);