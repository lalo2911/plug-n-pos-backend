import { Router } from 'express';
import userRoutes from './users.js';
import categoryRoutes from './categories.js';
import productRoutes from './products.js';
import orderRoutes from './orders.js';
import orderDetailRoutes from './order-details.js';
import authRoutes from './auth.js';
import businessRoutes from './business.js';

const router = Router();

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

export default router;