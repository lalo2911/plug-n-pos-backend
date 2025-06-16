import { Workday } from '../models/workdayModel.js';
import { User } from '../models/userModel.js';

export class WorkdayService {
    // Start workday for a business or specific employee
    async startWorkday(businessId, userId = null, activatedBy) {
        // If userId is provided, start workday for that specific employee
        // Otherwise, start workday for all employees in the business
        if (userId) {
            // Check if employee belongs to the business
            const user = await User.findOne({ _id: userId, business: businessId });
            if (!user) {
                throw new Error('El empleado no pertenece a este negocio');
            }

            // Find or create workday record for the employee
            const workday = await Workday.findOneAndUpdate(
                { business: businessId, user: userId },
                {
                    isActive: true,
                    activatedBy,
                    activatedAt: new Date(),
                    deactivatedBy: null,
                    deactivatedAt: null
                },
                { new: true, upsert: true }
            );

            return workday;
        } else {
            // Get all employees for the business
            const employees = await User.find({ business: businessId });

            // Start workday for all employees
            const workdayPromises = employees.map(employee =>
                Workday.findOneAndUpdate(
                    { business: businessId, user: employee._id },
                    {
                        isActive: true,
                        activatedBy,
                        activatedAt: new Date(),
                        deactivatedBy: null,
                        deactivatedAt: null
                    },
                    { new: true, upsert: true }
                )
            );

            // Also create a business-wide record
            workdayPromises.push(
                Workday.findOneAndUpdate(
                    { business: businessId, user: null },
                    {
                        isActive: true,
                        activatedBy,
                        activatedAt: new Date(),
                        deactivatedBy: null,
                        deactivatedAt: null
                    },
                    { new: true, upsert: true }
                )
            );

            await Promise.all(workdayPromises);

            return { success: true, message: 'Jornada iniciada para todos los empleados' };
        }
    }

    // End workday for a business or specific employee
    async endWorkday(businessId, userId = null, deactivatedBy) {
        if (userId) {
            // Check if employee belongs to the business
            const user = await User.findOne({ _id: userId, business: businessId });
            if (!user) {
                throw new Error('El empleado no pertenece a este negocio');
            }

            // Update workday record for the employee
            const workday = await Workday.findOneAndUpdate(
                { business: businessId, user: userId },
                {
                    isActive: false,
                    deactivatedBy,
                    deactivatedAt: new Date()
                },
                { new: true, upsert: true }
            );

            return workday;
        } else {
            // Get all employees for the business
            const employees = await User.find({ business: businessId });

            // End workday for all employees
            const workdayPromises = employees.map(employee =>
                Workday.findOneAndUpdate(
                    { business: businessId, user: employee._id },
                    {
                        isActive: false,
                        deactivatedBy,
                        deactivatedAt: new Date()
                    },
                    { new: true, upsert: true }
                )
            );

            // Also update the business-wide record
            workdayPromises.push(
                Workday.findOneAndUpdate(
                    { business: businessId, user: null },
                    {
                        isActive: false,
                        deactivatedBy,
                        deactivatedAt: new Date()
                    },
                    { new: true, upsert: true }
                )
            );

            await Promise.all(workdayPromises);

            return { success: true, message: 'Jornada finalizada para todos los empleados' };
        }
    }

    // Get workday status for a business or specific employee
    async getWorkdayStatus(businessId, userId = null) {
        // If userId is provided, get status for that specific employee
        if (userId) {
            const workday = await Workday.findOne({ business: businessId, user: userId });
            return workday || { isActive: false };
        }

        // Otherwise, get status for the business as a whole
        const workday = await Workday.findOne({ business: businessId, user: null });

        // If no business-wide status is found, return inactive by default
        if (!workday) {
            return { isActive: false };
        }

        // If business-wide status exists, return it
        return workday;
    }

    // Get workday status for all employees in a business
    async getAllEmployeesWorkdayStatus(businessId) {
        const employees = await User.find({ business: businessId }).select('_id name email avatar role');

        // Get workday status for each employee
        const workdayPromises = employees.map(async employee => {
            const workday = await Workday.findOne({ business: businessId, user: employee._id });
            return {
                ...employee.toObject(),
                workdayStatus: workday ? workday.isActive : false,
                activatedAt: workday ? workday.activatedAt : null,
                deactivatedAt: workday ? workday.deactivatedAt : null
            };
        });

        return Promise.all(workdayPromises);
    }

    // Check if an employee is allowed to create orders
    async isEmployeeAllowedToWork(businessId, userId) {
        // First check if business-wide workday is active
        const businessWorkday = await Workday.findOne({ business: businessId, user: null });

        // If business-wide workday is found and inactive, employee cannot work
        if (businessWorkday && !businessWorkday.isActive) {
            return false;
        }

        // Check employee-specific workday status
        const employeeWorkday = await Workday.findOne({ business: businessId, user: userId });

        // If employee-specific workday exists, return its status
        if (employeeWorkday) {
            return employeeWorkday.isActive;
        }

        // If no employee-specific record, create one with default inactive status
        return false;
    }
}