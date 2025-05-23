import { Order } from '../models/orderModel.js';
import { OrderDetail } from '../models/orderDetailModel.js';
import { Product } from '../models/productModel.js';
import { Category } from '../models/categoryModel.js';
import { User } from '../models/userModel.js';
import { Business } from '../models/businessModel.js';
import { Metric } from '../models/metricModel.js';

export class MetricService {
    // Obtener resumen general de métricas
    async getDashboardSummary(businessId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastWeekDate = new Date(today);
            lastWeekDate.setDate(today.getDate() - 7);

            const lastMonthDate = new Date(today);
            lastMonthDate.setMonth(today.getMonth() - 1);

            // Obtener métricas de ventas
            const [
                todaySales,
                weekSales,
                monthSales,
                totalSales,
                totalProducts,
                totalCategories,
                totalEmployees,
                topSellingProducts,
                salesByCategory,
                salesTrend
            ] = await Promise.all([
                this.getTotalSales(businessId, today, new Date()),
                this.getTotalSales(businessId, lastWeekDate, new Date()),
                this.getTotalSales(businessId, lastMonthDate, new Date()),
                this.getTotalSales(businessId, null, null),
                Product.countDocuments({ business: businessId }),
                Category.countDocuments({ business: businessId }),
                User.countDocuments({ business: businessId, role: 'employee' }),
                this.getTopSellingProducts(businessId, lastMonthDate, new Date(), 5),
                this.getSalesByCategory(businessId, lastMonthDate, new Date()),
                this.getSalesTrend(businessId)
            ]);

            return {
                sales: {
                    today: todaySales,
                    thisWeek: weekSales,
                    thisMonth: monthSales,
                    total: totalSales
                },
                inventory: {
                    totalProducts,
                    totalCategories
                },
                team: {
                    totalEmployees
                },
                topProducts: topSellingProducts,
                salesByCategory,
                salesTrend
            };
        } catch (error) {
            console.error('Error al obtener el resumen del dashboard:', error);
            throw new Error('No se pudo obtener el resumen del dashboard');
        }
    }

    // Obtener ventas totales en un período
    async getTotalSales(businessId, startDate = null, endDate = null) {
        try {
            const match = { business: businessId };

            if (startDate && endDate) {
                match.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            }

            const result = await Order.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: { $toDouble: "$total" } },
                        orderCount: { $sum: 1 }
                    }
                }
            ]);

            if (result.length > 0) {
                return {
                    amount: result[0].totalSales,
                    orderCount: result[0].orderCount,
                    averageOrder: result[0].orderCount > 0
                        ? result[0].totalSales / result[0].orderCount
                        : 0
                };
            }

            return { amount: 0, orderCount: 0, averageOrder: 0 };
        } catch (error) {
            console.error('Error al obtener las ventas totales:', error);
            throw new Error('No se pudieron obtener las ventas totales');
        }
    }

    // Obtener los productos más vendidos
    async getTopSellingProducts(businessId, startDate = null, endDate = null, limit = 5) {
        try {
            const match = { business: businessId };

            if (startDate && endDate) {
                match.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            }

            // Primero obtenemos los IDs de órdenes que coinciden con los criterios
            const orders = await Order.find(match).select('_id');
            const orderIds = orders.map(order => order._id);

            if (orderIds.length === 0) {
                return [];
            }

            // Luego usamos esos IDs para buscar en los detalles de órdenes
            const result = await OrderDetail.aggregate([
                {
                    $match: {
                        order_id: { $in: orderIds },
                        business: businessId
                    }
                },
                {
                    $group: {
                        _id: "$product_id",
                        totalQuantity: { $sum: "$quantity" },
                        totalRevenue: { $sum: { $toDouble: "$subtotal" } }
                    }
                },
                {
                    $sort: { totalRevenue: -1 }
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productInfo'
                    }
                },
                {
                    $unwind: '$productInfo'
                },
                {
                    $project: {
                        _id: 1,
                        name: '$productInfo.name',
                        totalQuantity: 1,
                        totalRevenue: 1,
                        price: { $toDouble: '$productInfo.price' }
                    }
                }
            ]);

            return result;
        } catch (error) {
            console.error('Error al obtener los productos más vendidos:', error);
            throw new Error('No se pudieron obtener los productos más vendidos');
        }
    }

    // Obtener ventas por categoría
    async getSalesByCategory(businessId, startDate = null, endDate = null) {
        try {
            const match = { business: businessId };

            if (startDate && endDate) {
                match.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            }

            // Primero obtenemos los IDs de órdenes que coinciden con los criterios
            const orders = await Order.find(match).select('_id');
            const orderIds = orders.map(order => order._id);

            if (orderIds.length === 0) {
                return [];
            }

            // Luego usamos esos IDs para buscar en los detalles de órdenes
            const result = await OrderDetail.aggregate([
                {
                    $match: {
                        order_id: { $in: orderIds },
                        business: businessId
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product_id',
                        foreignField: '_id',
                        as: 'productInfo'
                    }
                },
                {
                    $unwind: '$productInfo'
                },
                {
                    $group: {
                        _id: "$productInfo.category_id",
                        totalSales: { $sum: { $toDouble: "$subtotal" } },
                        totalQuantity: { $sum: "$quantity" }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'categoryInfo'
                    }
                },
                {
                    $unwind: '$categoryInfo'
                },
                {
                    $project: {
                        _id: 1,
                        name: '$categoryInfo.name',
                        totalSales: 1,
                        totalQuantity: 1
                    }
                },
                {
                    $sort: { totalSales: -1 }
                }
            ]);

            return result;
        } catch (error) {
            console.error('Error al obtener las ventas por categoría:', error);
            throw new Error('No se pudieron obtener las ventas por categoría');
        }
    }

    // Obtener tendencia de ventas diarias (últimos 30 días)
    async getSalesTrend(businessId, days = 30) {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days);

            const results = await Order.aggregate([
                {
                    $match: {
                        business: businessId,
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateTrunc: {
                                date: "$createdAt",
                                unit: "day",
                                timezone: "America/Mexico_City"
                            }
                        },
                        totalSales: { $sum: { $toDouble: "$total" } },
                        orderCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            // Crear un objeto con todas las fechas del rango
            const salesMap = {};
            for (let i = 0; i < days; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);

                // Convertir a medianoche en México (luego en UTC se verá como 06:00:00Z)
                const localizedDate = new Date(
                    new Intl.DateTimeFormat("en-US", {
                        timeZone: "America/Mexico_City",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }).format(currentDate)
                );

                const dateKey = localizedDate.toISOString();
                salesMap[dateKey] = {
                    date: dateKey,
                    totalSales: 0,
                    orderCount: 0
                };
            }

            // Llenar con los datos reales
            results.forEach(item => {
                const dateKey = new Date(item._id).toISOString();
                salesMap[dateKey] = {
                    date: dateKey,
                    totalSales: item.totalSales,
                    orderCount: item.orderCount
                };
            });

            // Convertir a array
            return Object.values(salesMap);
        } catch (error) {
            console.error('Error al obtener la tendencia de ventas:', error);
            throw new Error('No se pudo obtener la tendencia de ventas');
        }
    }

    // Obtener detalle de ventas por hora del día (para identificar horas pico)
    async getSalesByHourOfDay(businessId, startDate = null, endDate = null) {
        try {
            const match = { business: businessId };

            // Si se proporcionan fechas, debemos ajustarlas a la zona horaria de Mexico City
            if (startDate && endDate) {
                match.$expr = {
                    $and: [
                        {
                            $eq: [
                                {
                                    $dateToString: {
                                        date: "$createdAt",
                                        format: "%Y-%m-%d",
                                        timezone: "America/Mexico_City"
                                    }
                                },
                                {
                                    $dateToString: {
                                        date: new Date(startDate),
                                        format: "%Y-%m-%d",
                                        timezone: "America/Mexico_City"
                                    }
                                }
                            ]
                        }
                    ]
                };
            }

            const results = await Order.aggregate([
                {
                    $match: match
                },
                {
                    $addFields: {
                        dateMX: {
                            $dateToString: {
                                date: "$createdAt",
                                format: "%Y-%m-%d",
                                timezone: "America/Mexico_City"
                            }
                        },
                        hourOfDay: {
                            $hour: {
                                date: "$createdAt",
                                timezone: "America/Mexico_City"
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$hourOfDay",
                        totalSales: { $sum: { $toDouble: "$total" } },
                        orderCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                },
                {
                    $project: {
                        hour: "$_id",
                        totalSales: { $round: ["$totalSales", 2] },
                        orderCount: 1,
                        _id: 0
                    }
                }
            ]);

            // Asegurar que tenemos datos para todas las horas (0-23)
            const hourlyData = Array(24).fill().map((_, hour) => {
                const found = results.find(item => item.hour === hour);
                return found || { hour, totalSales: 0, orderCount: 0 };
            });

            return hourlyData;
        } catch (error) {
            console.error('Error al obtener ventas por hora:', error);
            throw new Error('No se pudieron obtener las ventas por hora');
        }
    }

    // Obtener productos con bajo inventario (si implementas seguimiento de inventario)
    async getLowInventoryAlert(businessId, threshold = 5) {
        // Esta función es un placeholder para futura implementación de inventario
        return [];
    }

    // Generar informe comparativo (este mes vs mes anterior)
    async getMonthlyComparison(businessId) {
        try {
            const today = new Date();

            // Este mes
            const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

            // Mes anterior
            const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

            // Obtener datos
            const currentMonthData = await this.getTotalSales(
                businessId,
                currentMonthStart,
                today
            );

            const lastMonthData = await this.getTotalSales(
                businessId,
                lastMonthStart,
                lastMonthEnd
            );

            // Calcular porcentajes de cambio
            const salesChange = lastMonthData.amount > 0
                ? ((currentMonthData.amount - lastMonthData.amount) / lastMonthData.amount) * 100
                : 100;

            const orderCountChange = lastMonthData.orderCount > 0
                ? ((currentMonthData.orderCount - lastMonthData.orderCount) / lastMonthData.orderCount) * 100
                : 100;

            const avgOrderChange = lastMonthData.averageOrder > 0
                ? ((currentMonthData.averageOrder - lastMonthData.averageOrder) / lastMonthData.averageOrder) * 100
                : 100;

            return {
                currentMonth: {
                    name: today.toLocaleString('default', { month: 'long' }),
                    year: today.getFullYear(),
                    ...currentMonthData
                },
                lastMonth: {
                    name: lastMonthStart.toLocaleString('default', { month: 'long' }),
                    year: lastMonthStart.getFullYear(),
                    ...lastMonthData
                },
                changes: {
                    salesChange,
                    orderCountChange,
                    avgOrderChange
                }
            };
        } catch (error) {
            console.error('Error al obtener la comparación mensual:', error);
            throw new Error('No se pudo obtener la comparación mensual');
        }
    }

    // Obtener ventas por día de la semana
    async getSalesByDayOfWeek(businessId, startDate = null, endDate = null) {
        try {
            const match = { business: businessId };

            if (startDate && endDate) {
                match.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            }

            const results = await Order.aggregate([
                {
                    $match: match
                },
                {
                    $group: {
                        _id: {
                            $dayOfWeek: {
                                date: "$createdAt",
                                timezone: "America/Mexico_City"
                            }
                        },
                        totalSales: { $sum: { $toDouble: "$total" } },
                        orderCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            // Nombres de días
            const dayNames = [
                'Domingo', 'Lunes', 'Martes',
                'Miércoles', 'Jueves', 'Viernes', 'Sábado'
            ];

            // Asegurar que tenemos datos para todos los días
            const salesByDay = Array(7).fill().map((_, i) => {
                const dayNumber = i + 1; // 1-7
                const found = results.find(item => item._id === dayNumber);
                return {
                    day: dayNames[i],
                    dayNumber,
                    totalSales: found ? found.totalSales : 0,
                    orderCount: found ? found.orderCount : 0
                };
            });

            return salesByDay;
        } catch (error) {
            console.error('Error al obtener ventas por día de la semana:', error);
            throw new Error('No se pudieron obtener las ventas por día de la semana');
        }
    }

    // Calcular y almacenar métricas del día anterior
    async storeDailyMetrics() {
        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            const dayEnd = new Date(yesterday);
            dayEnd.setHours(23, 59, 59, 999);

            // Obtener todos los negocios activos
            const businesses = await Business.find({ isActive: true }).select('_id');

            for (const business of businesses) {
                const businessId = business._id;

                // Obtener datos de ventas
                const salesData = await this.getTotalSales(businessId, yesterday, dayEnd);
                const topProducts = await this.getTopSellingProducts(businessId, yesterday, dayEnd, 5);
                const salesByCategory = await this.getSalesByCategory(businessId, yesterday, dayEnd);

                // Formatear datos para topProducts
                const formattedTopProducts = topProducts.map(p => ({
                    product: p._id,
                    quantity: p.totalQuantity,
                    revenue: p.totalRevenue
                }));

                // Formatear datos para salesByCategory
                const formattedSalesByCategory = salesByCategory.map(c => ({
                    category: c._id,
                    sales: c.totalSales
                }));

                // Crear o actualizar métricas
                await Metric.findOneAndUpdate(
                    {
                        business: businessId,
                        date: yesterday,
                        type: 'daily'
                    },
                    {
                        totalSales: salesData.amount,
                        orderCount: salesData.orderCount,
                        averageOrderValue: salesData.averageOrder,
                        topProducts: formattedTopProducts,
                        salesByCategory: formattedSalesByCategory
                    },
                    { upsert: true, new: true }
                );
            }

            return { success: true };
        } catch (error) {
            console.error('Error al almacenar métricas diarias:', error);
            throw new Error('No se pudieron almacenar las métricas diarias');
        }
    }
}