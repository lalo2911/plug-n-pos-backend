import { Router } from 'express';
import productRoutes from './products.js';
import categoryRoutes from './categories.js';
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
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

export default router;