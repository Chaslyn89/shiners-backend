// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { login, setupAdmin } = require('../controllers/authController');
const validate = require('../middleware/validate');
const loginLimiter = require('../middleware/rateLimiter');

// @route   POST /api/auth/login
router.post('/login', [
    loginLimiter,
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], validate, login);

// @route   POST /api/auth/setup
router.post('/setup', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, setupAdmin);

module.exports = router;
// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { login, setupAdmin } = require('../controllers/authController');
const validate = require('../middleware/validate');
const loginLimiter = require('../middleware/rateLimiter');

// @route   POST /api/auth/login
router.post('/login', [
    loginLimiter,
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], validate, login);

// @route   POST /api/auth/setup
router.post('/setup', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, setupAdmin);

module.exports = router;