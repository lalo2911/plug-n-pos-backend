import mongoose from 'mongoose';

const workdaySchema = new mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional if managing per-employee workdays
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    activatedAt: {
        type: Date
    },
    deactivatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deactivatedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Create a compound index for business and user
workdaySchema.index({ business: 1, user: 1 }, { unique: true });

export const Workday = mongoose.model('Workday', workdaySchema);