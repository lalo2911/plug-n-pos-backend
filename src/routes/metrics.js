import { Router } from 'express';
import { MetricController } from '../controllers/metricController.js';
import { protect, isOwner } from '../middlewares/authMiddleware.js';

const router = Router();
const metricController = new MetricController();

// Ruta para el resumen del dashboard
router.get('/dashboard', protect, isOwner, metricController.getDashboardSummary);

// Rutas para métricas específicas
router.get('/sales', protect, isOwner, metricController.getTotalSales);
router.get('/top-products', protect, isOwner, metricController.getTopSellingProducts);
router.get('/sales-by-category', protect, isOwner, metricController.getSalesByCategory);
router.get('/sales-trend', protect, isOwner, metricController.getSalesTrend);
router.get('/sales-by-hour', protect, isOwner, metricController.getSalesByHourOfDay);
router.get('/monthly-comparison', protect, isOwner, metricController.getMonthlyComparison);
router.get('/sales-by-day', protect, isOwner, metricController.getSalesByDayOfWeek);

export default router;