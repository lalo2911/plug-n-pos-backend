import { MetricService } from '../services/metricService.js';

const metricService = new MetricService();

export class MetricController {
    // Obtener resumen de dashboard
    async getDashboardSummary(req, res, next) {
        try {
            const businessId = req.user.business;

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario no está asociado a un negocio'
                });
            }

            const summaryData = await metricService.getDashboardSummary(businessId);

            return res.status(200).json({
                success: true,
                data: summaryData
            });
        } catch (error) {
            console.error('Error al obtener resumen del dashboard:', error);
            next(error);
        }
    }

    // Obtener ventas totales en un período
    async getTotalSales(req, res, next) {
        try {
            const businessId = req.user.business;
            const { startDate, endDate } = req.query;

            let start = null;
            let end = null;

            if (startDate) {
                start = new Date(startDate);
            }

            if (endDate) {
                end = new Date(endDate);
                // Establecer la hora al final del día
                end.setHours(23, 59, 59, 999);
            }

            const salesData = await metricService.getTotalSales(businessId, start, end);

            return res.status(200).json({
                success: true,
                data: salesData
            });
        } catch (error) {
            console.error('Error al obtener las ventas totales:', error);
            next(error);
        }
    }

    // Obtener productos más vendidos
    async getTopSellingProducts(req, res, next) {
        try {
            const businessId = req.user.business;
            const { startDate, endDate, limit = 5 } = req.query;

            let start = null;
            let end = null;

            if (startDate) {
                start = new Date(startDate);
            }

            if (endDate) {
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
            }

            const topProducts = await metricService.getTopSellingProducts(
                businessId,
                start,
                end,
                parseInt(limit)
            );

            return res.status(200).json({
                success: true,
                data: topProducts
            });
        } catch (error) {
            console.error('Error al obtener los productos más vendidos:', error);
            next(error);
        }
    }

    // Obtener ventas por categoría
    async getSalesByCategory(req, res, next) {
        try {
            const businessId = req.user.business;
            const { startDate, endDate } = req.query;

            let start = null;
            let end = null;

            if (startDate) {
                start = new Date(startDate);
            }

            if (endDate) {
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
            }

            const salesByCategory = await metricService.getSalesByCategory(businessId, start, end);

            return res.status(200).json({
                success: true,
                data: salesByCategory
            });
        } catch (error) {
            console.error('Error al obtener las ventas por categoría:', error);
            next(error);
        }
    }

    // Obtener tendencia de ventas
    async getSalesTrend(req, res, next) {
        try {
            const businessId = req.user.business;
            const { days = 30 } = req.query;

            const salesTrend = await metricService.getSalesTrend(businessId, parseInt(days));

            return res.status(200).json({
                success: true,
                data: salesTrend
            });
        } catch (error) {
            console.error('Error al obtener la tendencia de ventas:', error);
            next(error);
        }
    }

    // Obtener ventas por hora del día
    async getSalesByHourOfDay(req, res, next) {
        try {
            const businessId = req.user.business;
            const { startDate, endDate } = req.query;

            let start = null;
            let end = null;

            // Si no se proporcionan fechas, usar el día actual en zona horaria Mexico City
            if (!startDate && !endDate) {
                const today = new Date();

                start = today;
                end = today;
            } else {
                if (startDate) {
                    start = new Date(startDate);
                }

                if (endDate) {
                    end = new Date(endDate);
                }
            }

            const hourlyData = await metricService.getSalesByHourOfDay(businessId, start, end);

            return res.status(200).json({
                success: true,
                data: hourlyData
            });
        } catch (error) {
            console.error('Error al obtener ventas por hora:', error);
            next(error);
        }
    }

    // Obtener comparación mensual
    async getMonthlyComparison(req, res, next) {
        try {
            const businessId = req.user.business;

            const comparisonData = await metricService.getMonthlyComparison(businessId);

            return res.status(200).json({
                success: true,
                data: comparisonData
            });
        } catch (error) {
            console.error('Error al obtener la comparación mensual:', error);
            next(error);
        }
    }

    // Obtener ventas por día de la semana
    async getSalesByDayOfWeek(req, res, next) {
        try {
            const businessId = req.user.business;
            const { startDate, endDate } = req.query;

            let start = null;
            let end = null;

            if (startDate) {
                start = new Date(startDate);
            }

            if (endDate) {
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
            }

            const salesByDay = await metricService.getSalesByDayOfWeek(businessId, start, end);

            return res.status(200).json({
                success: true,
                data: salesByDay
            });
        } catch (error) {
            console.error('Error al obtener ventas por día de la semana:', error);
            next(error);
        }
    }
}