import { Router } from 'express';
import productRoutes from './products.js';

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

export default router;