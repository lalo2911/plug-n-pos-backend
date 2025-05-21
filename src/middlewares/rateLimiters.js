import rateLimit from 'express-rate-limit';

// Opciones comunes para todos los limitadores
const commonOptions = {
    standardHeaders: 'draft-7', // Habilita los encabezados RateLimit-*
    legacyHeaders: false, // Deshabilita los encabezados X-RateLimit-*
    message: (req, res) => {
        // Personalizar el mensaje de error aquí
        return res.status(429).json({
            status: 429,
            message: 'Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.',
        });
    }
};

// Limitador para API's generales (ej. GETs)
const apiLimiter = rateLimit({
    ...commonOptions,
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 250, // 250 solicitudes por hora por IP
    // message: 'Demasiadas solicitudes generales a la API. Por favor, intenta de nuevo en una hora.',
});

// Limitador estricto para inicio de sesión y registro
const authLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos por IP en 15 minutos
    message: 'Demasiados intentos. Por favor, intenta de nuevo en 15 minutos.',
});

// Limitador para creación/modificación de recursos (POST, PUT, DELETE)
const writeLimiter = rateLimit({
    ...commonOptions,
    windowMs: 30 * 60 * 1000, // 30 minutos
    max: 50, // 50 solicitudes por IP en 30 minutos
    message: 'Demasiadas solicitudes de escritura. Por favor, espera y vuelve a intentar.',
});

// Limitador para rutas muy específicas como métricas
const metricLimiter = rateLimit({
    ...commonOptions,
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 10, // 10 solicitudes por IP en 5 minutos
    message: 'Demasiadas solicitudes de métricas. Por favor, espera y vuelve a intentar.',
});

export {
    apiLimiter,
    authLimiter,
    writeLimiter,
    metricLimiter,
};