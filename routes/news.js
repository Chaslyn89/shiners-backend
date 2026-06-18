// routes/news.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} = require('../controllers/newsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public routes
router.get('/', getNews);
router.get('/:id', getNewsById);

// Admin routes
router.post('/', [
    auth,
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').isIn(['Academic', 'Co-Curricular', 'School News', 'Admissions', 'Achievement'])
        .withMessage('Invalid category')
], validate, createNews);

router.put('/:id', [
    auth,
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().isIn(['Academic', 'Co-Curricular', 'School News', 'Admissions', 'Achievement'])
        .withMessage('Invalid category')
], validate, updateNews);

router.delete('/:id', auth, deleteNews);

module.exports = router;
// routes/news.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} = require('../controllers/newsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public routes
router.get('/', getNews);
router.get('/:id', getNewsById);

// Admin routes
router.post('/', [
    auth,
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').isIn(['Academic', 'Co-Curricular', 'School News', 'Admissions', 'Achievement'])
        .withMessage('Invalid category')
], validate, createNews);

router.put('/:id', [
    auth,
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().isIn(['Academic', 'Co-Curricular', 'School News', 'Admissions', 'Achievement'])
        .withMessage('Invalid category')
], validate, updateNews);

router.delete('/:id', auth, deleteNews);

module.exports = router;