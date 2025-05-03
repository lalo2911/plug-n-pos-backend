import { BusinessService } from '../services/businessService.js';

const businessService = new BusinessService();

export class BusinessController {
    async createBusiness(req, res, next) {
        try {
            const userId = req.user._id;
            const business = await businessService.createBusiness(req.body, userId);
            res.status(201).json({ success: true, data: business });
        } catch (error) {
            next(error);
        }
    }

    async getBusiness(req, res, next) {
        try {
            const business = await businessService.getBusinessById(req.params.id);
            res.json({ success: true, data: business });
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUserBusiness(req, res, next) {
        try {
            const userId = req.user._id;
            const business = await businessService.getBusinessByUserId(userId);
            res.json({ success: true, data: business });
        } catch (error) {
            next(error);
        }
    }

    async updateBusiness(req, res, next) {
        try {
            const business = await businessService.updateBusiness(req.params.id, req.body);
            res.json({ success: true, data: business });
        } catch (error) {
            next(error);
        }
    }

    async generateInviteCode(req, res, next) {
        try {
            // const userId = req.user._id;
            const user = await req.user;

            if (!user.business) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const code = await businessService.generateInviteCode(user.business);
            res.json({ success: true, data: { code } });
        } catch (error) {
            next(error);
        }
    }

    async getBusinessEmployees(req, res, next) {
        try {
            const userId = req.user._id;
            const user = await req.user;

            if (!user.business) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const employees = await businessService.getBusinessEmployees(user.business);
            res.json({ success: true, data: employees });
        } catch (error) {
            next(error);
        }
    }
}