import { User } from '../models/userModel.js';
import { Business } from '../models/businessModel.js';

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
        const allowedFields = ['name', 'email', 'role', 'isActive', 'hasCompletedSetup', 'avatar', 'business'];
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
    async completeUserSetup(id, role, businessName = null) {
        // Validar el rol
        if (!['owner', 'employee'].includes(role)) {
            throw new Error('Invalid role');
        }

        const updateData = {
            role,
            hasCompletedSetup: true
        };

        // Si es owner y proporciona nombre de negocio, crear el negocio
        if (role === 'owner' && businessName) {
            // Crear el negocio
            const business = await Business.create({
                name: businessName,
                owner: id
            });

            // Agregar el ID del negocio al usuario
            updateData.business = business._id;
        }

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

    // Método para vincular un empleado a un negocio usando un código de invitación
    async joinBusinessWithCode(userId, inviteCode) {
        // Buscar el negocio con el código de invitación válido
        const business = await Business.findOne({
            'inviteCodes.code': inviteCode,
            'inviteCodes.isUsed': false
        });

        if (!business) {
            throw new Error('Código de invitación inválido o ya utilizado');
        }

        // Marcar el código como utilizado
        const inviteCodeIndex = business.inviteCodes.findIndex(
            invite => invite.code === inviteCode && !invite.isUsed
        );

        business.inviteCodes[inviteCodeIndex].isUsed = true;

        // Agregar el empleado al negocio
        if (!business.employees.includes(userId)) {
            business.employees.push(userId);
        }

        await business.save();

        // Actualizar el usuario con el ID del negocio y completar setup
        const user = await User.findByIdAndUpdate(
            userId,
            {
                business: business._id,
                hasCompletedSetup: true
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    // Obtener todos los usuarios por negocio
    async getUsersByBusiness(businessId) {
        return await User.find({ business: businessId }).select('-password');
    }
}