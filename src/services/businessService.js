import { Business } from '../models/businessModel.js';
import { User } from '../models/userModel.js';

export class BusinessService {
    // Crear un nuevo negocio
    async createBusiness(businessData, ownerId) {
        const business = await Business.create({
            ...businessData,
            owner: ownerId
        });

        // Actualizar el usuario con el ID del negocio
        await User.findByIdAndUpdate(ownerId, {
            business: business._id
        });

        return business;
    }

    // Obtener un negocio por ID
    async getBusinessById(id) {
        const business = await Business.findById(id)
            .populate('owner', 'name email')
            .populate('employees', 'name email');

        if (!business) {
            throw new Error('Negocio no encontrado');
        }

        return business;
    }

    // Obtener el negocio de un usuario
    async getBusinessByUserId(userId) {
        const user = await User.findById(userId);

        if (!user || !user.business) {
            throw new Error('Usuario sin negocio asociado');
        }

        return await this.getBusinessById(user.business);
    }

    // Actualizar un negocio
    async updateBusiness(id, businessData) {
        const business = await Business.findByIdAndUpdate(
            id,
            businessData,
            { new: true, runValidators: true }
        );

        if (!business) {
            throw new Error('Negocio no encontrado');
        }

        return business;
    }

    // Generar un código de invitación
    async generateInviteCode(businessId) {
        const business = await Business.findById(businessId);

        if (!business) {
            throw new Error('Negocio no encontrado');
        }

        const code = await business.generateInviteCode();
        return code;
    }

    // Validar un código de invitación y asociar al empleado
    async validateInviteCode(code, employeeId) {
        // Buscar el negocio con el código de invitación válido
        const business = await Business.findOne({
            'inviteCodes.code': code,
            'inviteCodes.isUsed': false
        });

        if (!business) {
            throw new Error('Código de invitación inválido o ya utilizado');
        }

        // Actualizar el código como utilizado
        const inviteCodeIndex = business.inviteCodes.findIndex(
            invite => invite.code === code && !invite.isUsed
        );

        business.inviteCodes[inviteCodeIndex].isUsed = true;

        // Agregar el empleado al negocio
        if (!business.employees.includes(employeeId)) {
            business.employees.push(employeeId);
        }

        await business.save();

        // Actualizar el usuario con el ID del negocio
        await User.findByIdAndUpdate(employeeId, {
            business: business._id
        });

        return business;
    }

    // Obtener todos los empleados de un negocio
    async getBusinessEmployees(businessId) {
        const business = await Business.findById(businessId)
            .populate('employees', 'name email avatar role');

        if (!business) {
            throw new Error('Negocio no encontrado');
        }

        return business.employees;
    }
}