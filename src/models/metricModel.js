import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    totalSales: {
        type: mongoose.Types.Decimal128,
        default: 0
    },
    orderCount: {
        type: Number,
        default: 0
    },
    averageOrderValue: {
        type: mongoose.Types.Decimal128,
        default: 0
    },
    topProducts: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        revenue: mongoose.Types.Decimal128
    }],
    salesByCategory: [{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        sales: mongoose.Types.Decimal128
    }],
    // Métricas adicionales que podrían ser útiles
    newCustomers: {
        type: Number,
        default: 0
    },
    compareWithPrevious: {
        salesGrowth: Number, // porcentaje
        orderCountGrowth: Number // porcentaje
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
metricSchema.index({ business: 1, date: 1, type: 1 });

export const Metric = mongoose.model('Metric', metricSchema);