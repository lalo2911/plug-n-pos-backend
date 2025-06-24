import { body } from 'express-validator';

// Registro local
export const validateRegister = [
    body('email')
        .isEmail().withMessage('El correo electrónico no es válido')
        .normalizeEmail(),

    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre no puede superar los 50 caracteres'),

    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Login local
export const validateLogin = [
    body('email')
        .isEmail().withMessage('El correo electrónico no es válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
];

// Actualización de perfil
export const validateUpdateProfile = [
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre no puede estar vacío')
        .isLength({ max: 50 }).withMessage('El nombre no puede superar los 50 caracteres'),

    body('email')
        .optional()
        .isEmail().withMessage('El correo electrónico no es válido')
        .normalizeEmail(),

    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('currentPassword')
        .optional()
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Código de autorización (para /exchange-code)
export const validateExchangeCode = [
    body('code')
        .notEmpty().withMessage('El código de autorización es obligatorio')
];
