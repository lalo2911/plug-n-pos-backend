import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/database.js';
import { setupCronJobs } from './utils/cronJobs.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Connect to MongoDB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on mode ${NODE_ENV} in port ${PORT}`);
        console.log(`URL: ${API_URL}`);
        setupCronJobs();
    });
});

// Manejar el cierre de la aplicación (Ctrl + C, etc.)
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Conexión a MongoDB cerrada por SIGINT');
        process.exit(0);
    });
});

// Manejar cierre en entornos como Docker o procesos en producción donde el sistema termina el proceso
process.on('SIGTERM', () => {
    mongoose.connection.close(() => {
        console.log('Conexión a MongoDB cerrada por SIGTERM');
        process.exit(0);
    });
});