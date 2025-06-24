import rateLimit from 'express-rate-limit';

function rateLimitErrorHandler(req, res) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Si es una ruta de redirección OAuth
    const isGoogleLogin = req.originalUrl.includes('/auth/google');

    if (isGoogleLogin) {
        return res.redirect(`${frontendUrl}/login?error=too_many_requests`);
    }

    // Respuesta normal para APIs JSON
    return res.status(429).json({
        status: 429,
        message: 'Demasiados intentos. Por favor, intenta de nuevo más tarde.',
    });
}

// Opciones comunes para todos los limitadores
const commonOptions = {
    standardHeaders: 'draft-7', // Habilita los encabezados RateLimit-*
    legacyHeaders: false, // Deshabilita los encabezados X-RateLimit-*
    handler: rateLimitErrorHandler
};

// Limitador para API's generales (ej. GETs)
const apiLimiter = rateLimit({
    ...commonOptions,
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 250, // 250 solicitudes por hora por IP
});

// Limitador estricto para inicio de sesión y registro
const authLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 9, // 9 intentos por IP en 15 minutos
});

// Limitador para creación/modificación de recursos (POST, PUT, DELETE)
const writeLimiter = rateLimit({
    ...commonOptions,
    windowMs: 30 * 60 * 1000, // 30 minutos
    max: 75, // 75 solicitudes por IP en 30 minutos
});

// Limitador para rutas muy específicas como métricas
const metricLimiter = rateLimit({
    ...commonOptions,
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 25, // 25 solicitudes por IP en 5 minutos
});

export {
    apiLimiter,
    authLimiter,
    writeLimiter,
    metricLimiter,
};