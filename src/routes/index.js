import { Router } from 'express';
import productRoutes from './products.js';
import categoryRoutes from './categories.js';

const router = Router();

// Test route
router.get('/health', (req, res) => {
  res.json({
    status: 200,
    message: 'API is running'
  });
});

// Routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

export default router;