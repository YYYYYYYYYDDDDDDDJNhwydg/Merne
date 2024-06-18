const express = require('express');
const { register, login, getMe } = require('../controller/user.controller');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const handleValidationErrors = require('../utils/handleValidationErrors');
const checkAuth = require('../utils/cheackAuth');

const router = express.Router();

router.post('/auth/login', loginValidation, handleValidationErrors, login);
router.post('/auth/register', registerValidation, handleValidationErrors, register);
router.get('/auth/me', checkAuth, getMe);

module.exports = router;
