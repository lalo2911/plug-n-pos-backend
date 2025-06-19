import { body, param } from 'express-validator';

export const validateBusiness = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre del negocio es obligatorio')
        .isLength({ max: 75 }).withMessage('El nombre no puede superar los 75 caracteres'),

    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('La dirección no puede superar los 200 caracteres'),

    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9+\-()\s]*$/).withMessage('El número de teléfono contiene caracteres inválidos')
        .isLength({ max: 20 }).withMessage('El número de teléfono no puede superar los 20 caracteres')
];

export const validateBusinessId = [
    param('id')
        .isMongoId().withMessage('El ID del negocio no es válido')
];
