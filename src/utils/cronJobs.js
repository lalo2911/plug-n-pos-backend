import cron from 'node-cron';
import { MetricService } from '../services/metricService.js';
import { RefreshToken } from '../models/refreshTokenModel.js';
import { Business } from '../models/businessModel.js';

// Configuración de tareas programadas
export const setupCronJobs = () => {
    // Tarea 1: Cálculo de métricas diarias
    cron.schedule('0 2 * * *', async () => { // Ejecutar a las 2 AM todos los días
        console.log('Ejecutando tarea programada: Cálculo de métricas diarias');
        try {
            await MetricService.storeDailyMetrics();
            console.log('Métricas diarias calculadas y almacenadas correctamente');
        } catch (error) {
            console.error('Error al ejecutar el cálculo de métricas diarias:', error);
        }
    }, {
        scheduled: true,
        timezone: "America/Mexico_City"
    });

    // Tarea 2: Limpieza de tokens revocados antiguos
    cron.schedule('0 0 * * *', async () => { // Ejecutar cada día a medianoche
        console.log('Ejecutando tarea programada: Limpieza de tokens revocados');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Establece la fecha al inicio del día de hoy (00:00:00)

            const result = await RefreshToken.deleteMany({
                isRevoked: true,
                updatedAt: { $lt: today }
            });

            console.log(`Se limpiaron ${result.deletedCount} tokens de refresco revocados.`);
        } catch (error) {
            console.error('Error al limpiar los tokens de refresco:', error);
        }
    }, {
        scheduled: true,
        timezone: "America/Mexico_City"
    });

    // Tarea 3: Limpieza de códigos de invitación expirados
    cron.schedule('0 1 * * *', async () => { // Ejecutar todos los días a la 1 AM
        console.log('Ejecutando tarea programada: Limpieza de códigos de invitación vencidos');
        try {
            const expiryDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 días atrás

            const result = await Business.updateMany(
                {},
                {
                    $pull: {
                        inviteCodes: { createdAt: { $lt: expiryDate } }
                    }
                }
            );

            console.log(`Se modificaron ${result.modifiedCount} documentos de negocios para limpiar códigos de invitación expirados.`);
        } catch (error) {
            console.error('Error al limpiar los códigos de invitación vencidos:', error);
        }
    }, {
        scheduled: true,
        timezone: "America/Mexico_City"
    });
};