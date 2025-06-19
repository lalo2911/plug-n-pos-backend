import { body, param } from 'express-validator';

export const validateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 75 }).withMessage('El nombre no puede superar los 75 caracteres'),

    body('price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),

    body('category_id')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isMongoId().withMessage('El ID de la categoría no es válido'),

    // Optional: description
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('La descripción no puede superar los 500 caracteres'),
];

export const validateProductId = [
    param('id')
        .isMongoId().withMessage('ID de producto inválido')
];
