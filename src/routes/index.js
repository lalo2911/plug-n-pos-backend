import { Router } from 'express';
import userRoutes from './users.js';
import categoryRoutes from './categories.js';
import productRoutes from './products.js';
import orderRoutes from './orders.js';
import orderDetailRoutes from './order-details.js';
import authRoutes from './auth.js';
import businessRoutes from './business.js';
import metricRoutes from './metrics.js';
import workdayRoutes from './workday.js';

import { apiLimiter } from '../middlewares/rateLimiters.js';

const router = Router();

router.use(apiLimiter);

// Test route
router.get('/health', (req, res) => {
  res.json({
    status: 200,
    message: 'API is running'
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/order-details', orderDetailRoutes);
router.use('/business', businessRoutes);
router.use('/metrics', metricRoutes);
router.use('/workday', workdayRoutes);

export default router;