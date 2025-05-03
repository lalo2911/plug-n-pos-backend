import cron from 'node-cron';
import { MetricService } from '../services/metricService.js';

// Configuración de tareas programadas
export const setupCronJobs = () => {
    // Ejecutar a las 2 AM todos los días (cuando la carga del sistema es menor)
    cron.schedule('0 2 * * *', async () => {
        console.log('Ejecutando tarea programada: Cálculo de métricas diarias');
        try {
            await MetricService.storeDailyMetrics();
            console.log('Métricas diarias calculadas y almacenadas correctamente');
        } catch (error) {
            console.error('Error al ejecutar el cálculo de métricas diarias:', error);
        }
    }, {
        scheduled: true,
        timezone: "America/Mexico_City" // Ajusta a tu zona horaria
    });
};