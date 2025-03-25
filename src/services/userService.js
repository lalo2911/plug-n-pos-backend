import { User } from '../models/userModel.js';

export class UserService {
    async getAllUsers() {
        return await User.find();
    }

    async getUserById(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async createUser(userData) {
        return await User.create(userData);
    }

    async updateUser(id, userData) {
        const user = await User.findByIdAndUpdate(
            id,
            userData,
            { new: true, runValidators: true }
        );
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}