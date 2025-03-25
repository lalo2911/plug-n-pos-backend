import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        unique: true,
        type: String,
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    password: {
        type: String,
        required: false,
    },
    authSource: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);