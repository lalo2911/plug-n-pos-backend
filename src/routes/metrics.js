import { Router } from 'express';
import { MetricController } from '../controllers/metricController.js';
import { protect, isOwner } from '../middlewares/authMiddleware.js';
import { metricLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const metricController = new MetricController();

// Ruta para el resumen del dashboard
router.get('/dashboard', protect, isOwner, metricLimiter, metricController.getDashboardSummary);

// Rutas para métricas específicas
router.get('/sales', protect, isOwner, metricLimiter, metricController.getTotalSales);
router.get('/top-products', protect, isOwner, metricLimiter, metricController.getTopSellingProducts);
router.get('/sales-by-category', protect, isOwner, metricLimiter, metricController.getSalesByCategory);
router.get('/sales-trend', protect, isOwner, metricLimiter, metricController.getSalesTrend);
router.get('/sales-by-hour', protect, isOwner, metricLimiter, metricController.getSalesByHourOfDay);
router.get('/monthly-comparison', protect, isOwner, metricLimiter, metricController.getMonthlyComparison);
router.get('/sales-by-day', protect, isOwner, metricLimiter, metricController.getSalesByDayOfWeek);

export default router;