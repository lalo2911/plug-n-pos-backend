import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId, type: 'access' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Token de acceso de corta duración
    );
};

export const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
};

export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.type === 'access' ? decoded : null;
    } catch (error) {
        return null;
    }
};

// Mantener la función original para compatibilidad temporal
export const generateToken = (userId) => {
    return generateAccessToken(userId);
};

export const verifyToken = (token) => {
    return verifyAccessToken(token);
};