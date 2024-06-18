const { body } = require('express-validator');

const loginValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
];

const registerValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('fullName').isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
    body('avatarUrl').optional().isURL().withMessage('Invalid URL format'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
];

module.exports = { registerValidation, loginValidation };
