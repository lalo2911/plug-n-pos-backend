import { body, param } from 'express-validator';

export const validateCategory = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre no puede superar los 50 caracteres')
];

export const validateCategoryId = [
    param('id')
        .isMongoId().withMessage('El ID de la categoría no es válido')
];
