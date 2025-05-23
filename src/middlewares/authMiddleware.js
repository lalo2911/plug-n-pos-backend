import { verifyToken } from '../utils/jwtUtils.js';
import { User } from '../models/userModel.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }

        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            message: 'Not authorized'
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

// Middleware para verificar que el usuario sea un empleado o un propietario
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

// Middleware para verificar roles específicos
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