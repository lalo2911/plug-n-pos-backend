import { Router } from 'express';
import userRoutes from './users.js';
import categoryRoutes from './categories.js';
import productRoutes from './products.js';
import orderRoutes from './orders.js';

const router = Router();

// Test route
router.get('/health', (req, res) => {
  res.json({
    status: 200,
    message: 'API is running'
  });
});

// Routes
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

export default router;