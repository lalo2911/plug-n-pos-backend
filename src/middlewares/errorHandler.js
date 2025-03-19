export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    res.status(status).json({
        success: false,
        status,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    });
};