import { WorkdayService } from '../services/workdayService.js';

const workdayService = new WorkdayService();

// Middleware to check if employee is allowed to create orders
export const isWorkdayActive = async (req, res, next) => {
    try {
        // Skip check for owners
        if (req.user.role === 'owner') {
            return next();
        }

        const businessId = req.user.business;
        const userId = req.user._id;

        if (!businessId) {
            return res.status(400).json({
                success: false,
                message: 'No tienes un negocio asociado'
            });
        }

        const isAllowed = await workdayService.isEmployeeAllowedToWork(businessId, userId);

        if (!isAllowed) {
            return res.status(403).json({
                success: false,
                message: 'La jornada laboral no está activa. Contacta al dueño del negocio.'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};