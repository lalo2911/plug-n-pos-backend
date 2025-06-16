import { verifyAccessToken } from '../utils/jwtUtils.js';
import { User } from '../models/userModel.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required',
                code: 'TOKEN_REQUIRED'
            });
        }

        // Verificar access token
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired access token',
                code: 'TOKEN_EXPIRED'
            });
        }

        // Obtener usuario del token
        req.user = await User.findById(decoded.id).select('-password -googleId');

        if (!req.user || !req.user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User not found or inactive',
                code: 'USER_NOT_FOUND'
            });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            code: 'AUTH_FAILED'
        });
    }
};

export const isOwner = (req, res, next) => {
    if (req.user && req.user.role === 'owner') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'No autorizado. Se requiere rol de propietario'
        });
    }
};

export const isAllowedUser = (req, res, next) => {
    if (req.user && (req.user.role === 'employee' || req.user.role === 'owner')) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'No autorizado. Se requiere rol de empleado o propietario'
        });
    }
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: `No autorizado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`
            });
        }
    };
};