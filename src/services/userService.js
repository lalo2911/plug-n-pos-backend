import { User } from '../models/userModel.js';

export class UserService {
    async getAllUsers() {
        return await User.find().select('-password');
    }

    async getUserById(id) {
        const user = await User.findById(id).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async createUser(userData) {
        const user = await User.create(userData);
        const userObject = user.toObject();
        delete userObject.password;
        return userObject;
    }

    async updateUser(id, userData) {
        // Filtrar campos permitidos para actualizar
        const allowedFields = ['name', 'email', 'role', 'isActive', 'hasCompletedSetup', 'avatar'];
        const updateData = {};

        // Solo incluir campos permitidos que vengan en la solicitud
        allowedFields.forEach(field => {
            if (userData[field] !== undefined) {
                updateData[field] = userData[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

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

    // Método para completar el setup del usuario
    async completeUserSetup(id, role) {
        // Validar el rol
        if (!['owner', 'employee'].includes(role)) {
            throw new Error('Invalid role');
        }

        const user = await User.findByIdAndUpdate(
            id,
            {
                role,
                hasCompletedSetup: true
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}