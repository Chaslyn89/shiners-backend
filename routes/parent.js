const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
    registerParent, 
    loginParent, 
    getParentDashboard,
    getStudentGrades,
    getStudentFees
} = require('../controllers/parentController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// @route   POST /api/parent/register
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional(),
    body('studentName').notEmpty().withMessage('Student name is required'),
    body('studentGrade').notEmpty().withMessage('Student grade is required')
], validate, registerParent);

// @route   POST /api/parent/login
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], validate, loginParent);

// @route   GET /api/parent/dashboard
router.get('/dashboard', auth, getParentDashboard);

// @route   GET /api/parent/grades/:studentId
router.get('/grades/:studentId', auth, getStudentGrades);

// @route   GET /api/parent/fees/:studentId
router.get('/fees/:studentId', auth, getStudentFees);

module.exports = router;