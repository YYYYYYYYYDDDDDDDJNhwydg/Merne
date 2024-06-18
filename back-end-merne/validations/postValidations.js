const { body } = require('express-validator');

const postCreateValidations = [
    body('title').isLength({ min: 3 }).isString().withMessage('Введите заголовог статьи'),
    body('text').isLength({ min: 10 }).isString().withMessage('Введите текст статьи'),
    body('tag').optional().isString().withMessage('Неверный формат тегов (укажите массив)'),
    body('imageUrl').optional().isString().withMessage('Неверная ссылка на изображение'),
];

module.exports = { postCreateValidations };
