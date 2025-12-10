const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

// POST /api/auth/register - RF01
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login - RF02
router.post('/login', validateLogin, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;

