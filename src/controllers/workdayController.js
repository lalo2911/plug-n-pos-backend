import { sseEventEmitter } from '../services/sseEventEmitter.js';
import { WorkdayService } from '../services/workdayService.js';
import { verifyAccessToken } from '../utils/jwtUtils.js';
import { User } from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';

const workdayService = new WorkdayService();

export class WorkdayController {
    // Start workday for a business or employee
    async startWorkday(req, res, next) {
        try {
            const businessId = req.user.business;
            const activatedBy = req.user._id;
            const { userId: rawUserId } = req.body; // Optional employee ID
            const userId = rawUserId ?? null;

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const result = await workdayService.startWorkday(businessId, userId, activatedBy);

            // Emitir evento SSE - userId puede ser null (para todos) o específico
            sseEventEmitter.emitWorkdayChange(businessId, userId, {
                action: 'start',
                isActive: true,
                userId,
                activatedBy,
                activatedAt: new Date()
            });

            res.json({
                success: true,
                data: result,
                message: userId
                    ? 'Jornada iniciada para el empleado'
                    : 'Jornada iniciada para todos los empleados'
            });
        } catch (error) {
            next(error);
        }
    }

    // End workday for a business or employee
    async endWorkday(req, res, next) {
        try {
            const businessId = req.user.business;
            const deactivatedBy = req.user._id;
            const { userId: rawUserId } = req.body; // Optional employee ID
            const userId = rawUserId ?? null;

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const result = await workdayService.endWorkday(businessId, userId, deactivatedBy);

            // Emitir evento SSE - userId puede ser null (para todos) o específico
            sseEventEmitter.emitWorkdayChange(businessId, userId, {
                action: 'end',
                isActive: false,
                userId,
                deactivatedBy,
                deactivatedAt: new Date()
            });

            res.json({
                success: true,
                data: result,
                message: userId
                    ? 'Jornada finalizada para el empleado'
                    : 'Jornada finalizada para todos los empleados'
            });
        } catch (error) {
            next(error);
        }
    }

    // Get workday status for a business or employee
    async getWorkdayStatus(req, res, next) {
        try {
            const businessId = req.user.business;
            const { userId } = req.query; // Optional employee ID

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const status = await workdayService.getWorkdayStatus(businessId, userId || null);

            res.json({
                success: true,
                data: status
            });
        } catch (error) {
            next(error);
        }
    }

    // Get workday status for all employees in a business
    async getAllEmployeesWorkdayStatus(req, res, next) {
        try {
            const businessId = req.user.business;

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            const employees = await workdayService.getAllEmployeesWorkdayStatus(businessId);

            res.json({
                success: true,
                data: employees
            });
        } catch (error) {
            next(error);
        }
    }

    // Stream workday status changes via SSE
    async streamWorkdayStatus(req, res, next) {
        try {
            // Obtener token del query parameter
            const token = req.query.token;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access token required',
                    code: 'TOKEN_REQUIRED'
                });
            }

            // Verificar el token
            const decoded = verifyAccessToken(token);

            // Obtener usuario del token
            req.user = await User.findById(decoded.id).select('-password');

            const businessId = req.user.business;
            const userId = req.user._id;

            if (!businessId) {
                return res.status(400).json({
                    success: false,
                    message: 'No tienes un negocio asociado'
                });
            }

            // Configurar headers SSE
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:5173',
                'Access-Control-Allow-Credentials': 'true'
            });

            // Generar ID único para este cliente
            const clientId = uuidv4();

            // Agregar cliente al event emitter
            sseEventEmitter.addClient(clientId, res, userId, businessId);

            // Enviar estado inicial
            try {
                const initialStatus = await workdayService.getWorkdayStatus(businessId, userId);
                res.write(`data: ${JSON.stringify({
                    type: 'initial_status',
                    data: initialStatus,
                    timestamp: new Date().toISOString()
                })}\n\n`);
            } catch (error) {
                // console.error('Error getting initial workday status');
            }

            // Mantener conexión viva con heartbeat cada 30 segundos
            const heartbeat = setInterval(() => {
                try {
                    res.write(`data: ${JSON.stringify({
                        type: 'heartbeat',
                        timestamp: new Date().toISOString()
                    })}\n\n`);
                } catch (error) {
                    clearInterval(heartbeat);
                    sseEventEmitter.removeClient(clientId);
                }
            }, 30000);

            // Cleanup cuando la conexión se cierra
            req.on('close', () => {
                clearInterval(heartbeat);
                sseEventEmitter.removeClient(clientId);
            });

            req.on('aborted', () => {
                clearInterval(heartbeat);
                sseEventEmitter.removeClient(clientId);
            });

        } catch (error) {
            next(error);
        }
    }
}