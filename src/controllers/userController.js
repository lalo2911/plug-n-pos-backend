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
            const { role } = req.body;

            if (!role) {
                return res.status(400).json({
                    success: false,
                    message: 'El rol es requerido'
                });
            }

            const user = await userService.completeUserSetup(userId, role);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }
}