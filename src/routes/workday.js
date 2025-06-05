import { Router } from 'express';
import { WorkdayController } from '../controllers/workdayController.js';
import { protect, isOwner } from '../middlewares/authMiddleware.js';
import { writeLimiter } from '../middlewares/rateLimiters.js';

const router = Router();
const workdayController = new WorkdayController();

// Rutas para gestión de jornadas laborales
router.post('/start', protect, isOwner, writeLimiter, workdayController.startWorkday);
router.post('/end', protect, isOwner, writeLimiter, workdayController.endWorkday);
router.get('/status', protect, workdayController.getWorkdayStatus);
router.get('/employees', protect, isOwner, workdayController.getAllEmployeesWorkdayStatus);

export default router;