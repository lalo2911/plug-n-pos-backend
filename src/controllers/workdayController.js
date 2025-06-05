import { WorkdayService } from '../services/workdayService.js';

const workdayService = new WorkdayService();

export class WorkdayController {
    // Start workday for a business or employee
    async startWorkday(req, res, next) {
        try {
            const businessId = req.user.business;
            const activatedBy = req.user._id;
            const { userId } = req.body; // Optional employee ID

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const result = await workdayService.startWorkday(businessId, userId, activatedBy);

            res.json({
                success: true,
                data: result,
                message: userId
                    ? 'Jornada iniciada para el empleado'
                    : 'Jornada iniciada para todos los empleados'
            });
        } catch (error) {
            next(error);
        }
    }

    // End workday for a business or employee
    async endWorkday(req, res, next) {
        try {
            const businessId = req.user.business;
            const deactivatedBy = req.user._id;
            const { userId } = req.body; // Optional employee ID

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const result = await workdayService.endWorkday(businessId, userId, deactivatedBy);

            res.json({
                success: true,
                data: result,
                message: userId
                    ? 'Jornada finalizada para el empleado'
                    : 'Jornada finalizada para todos los empleados'
            });
        } catch (error) {
            next(error);
        }
    }

    // Get workday status for a business or employee
    async getWorkdayStatus(req, res, next) {
        try {
            const businessId = req.user.business;
            const { userId } = req.query; // Optional employee ID

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const status = await workdayService.getWorkdayStatus(businessId, userId || null);

            res.json({
                success: true,
                data: status
            });
        } catch (error) {
            next(error);
        }
    }

    // Get workday status for all employees in a business
    async getAllEmployeesWorkdayStatus(req, res, next) {
        try {
            const businessId = req.user.business;

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const employees = await workdayService.getAllEmployeesWorkdayStatus(businessId);

            res.json({
                success: true,
                data: employees
            });
        } catch (error) {
            next(error);
        }
    }
}