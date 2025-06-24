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
    description: {
        type: String,
        trim: true
    },
    image_url: {
        type: String,
        default: null
    },
    image_public_id: {
        type: String,
        default: null // Para poder eliminar la imagen de Cloudinary
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please add a category']
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    }
}, {
    timestamps: true
});

export const Product = mongoose.model('Product', productSchema);