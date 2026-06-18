// controllers/newsController.js
const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 });
        res.json({
            success: true,
            count: news.length,
            data: news
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }
        res.json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create news
// @route   POST /api/news
// @access  Private (Admin only)
const createNews = async (req, res) => {
    try {
        const { title, category, content, image } = req.body;
        
        const news = await News.create({
            title,
            category,
            content,
            image,
            author: req.user.username || 'Admin'
        });

        res.status(201).json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private (Admin only)
const updateNews = async (req, res) => {
    try {
        const { title, category, content, image } = req.body;
        
        let news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        news = await News.findByIdAndUpdate(
            req.params.id,
            { title, category, content, image },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private (Admin only)
const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        await news.deleteOne();
        res.json({
            success: true,
            message: 'News deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = { getNews, getNewsById, createNews, updateNews, deleteNews };
// controllers/newsController.js
const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 });
        res.json({
            success: true,
            count: news.length,
            data: news
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }
        res.json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create news
// @route   POST /api/news
// @access  Private (Admin only)
const createNews = async (req, res) => {
    try {
        const { title, category, content, image } = req.body;
        
        const news = await News.create({
            title,
            category,
            content,
            image,
            author: req.user.username || 'Admin'
        });

        res.status(201).json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private (Admin only)
const updateNews = async (req, res) => {
    try {
        const { title, category, content, image } = req.body;
        
        let news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        news = await News.findByIdAndUpdate(
            req.params.id,
            { title, category, content, image },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private (Admin only)
const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        await news.deleteOne();
        res.json({
            success: true,
            message: 'News deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = { getNews, getNewsById, createNews, updateNews, deleteNews };