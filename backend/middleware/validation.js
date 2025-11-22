import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
export const validateSignup = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('name')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .escape(),
  body('phone')
    .optional()
    .matches(/^[0-9\s\-\+\(\)]+$/).withMessage('Please provide a valid phone number'),
  body('company')
    .optional()
    .trim()
    .escape(),
  body('currentProject')
    .optional()
    .trim()
    .escape(),
  validate
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

/**
 * Validation rules for creating/updating material
 */
export const validateMaterial = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters')
    .escape(),
  body('category')
    .isIn(['vallas', 'conos', 'palets', 'andamios', 'herramientas', 'maquinaria', 'materiales-construccion', 'señalizacion', 'proteccion', 'otros'])
    .withMessage('Invalid category'),
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('unit')
    .isIn(['unidades', 'metros', 'kg', 'cajas', 'palets', 'lotes'])
    .withMessage('Invalid unit'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be 0 or greater'),
  body('condition')
    .isIn(['nuevo', 'como-nuevo', 'buen-estado', 'usado', 'necesita-reparacion'])
    .withMessage('Invalid condition'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .escape(),
  body('projectName')
    .optional()
    .trim()
    .escape(),
  validate
];

/**
 * Validation rules for creating transaction
 */
export const validateTransaction = [
  body('materialId')
    .isMongoId().withMessage('Invalid material ID'),
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
    .escape(),
  validate
];

/**
 * Validation rules for MongoDB ObjectId
 */
export const validateObjectId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  validate
];

/**
 * Validation rules for pagination
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];

export default {
  validate,
  validateSignup,
  validateLogin,
  validateMaterial,
  validateTransaction,
  validateObjectId,
  validatePagination
};

