import { UserService } from '../services/userService.js';

const userService = new UserService();

export class UserController {
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    }

    async getUser(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    async createUser(req, res, next) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const user = await userService.deleteUser(req.params.id);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    async completeSetup(req, res, next) {
        try {
            const userId = req.user._id;
            const { role, businessName } = req.body;

            if (!role) {
                return res.status(400).json({
                    success: false,
                    message: 'El rol es requerido'
                });
            }

            // Si es owner, puede proporcionar un nombre de negocio
            // Si es empleado, no necesita nombre de negocio
            const user = await userService.completeUserSetup(userId, role, businessName);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    async joinBusinessWithCode(req, res, next) {
        try {
            const userId = req.user._id;
            const { inviteCode } = req.body;

            if (!inviteCode) {
                return res.status(400).json({
                    success: false,
                    message: 'El código de invitación es requerido'
                });
            }

            const user = await userService.joinBusinessWithCode(userId, inviteCode);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    async getEmployeesByBusiness(req, res, next) {
        try {
            // Obtener el negocio del usuario
            const businessId = req.user.business;

            // Verificar que el usuario tenga un negocio asociado
            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const users = await userService.getEmployeesByBusiness(businessId);
            res.json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    }
}