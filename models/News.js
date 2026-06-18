// models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Academic', 'Co-Curricular', 'School News', 'Admissions', 'Achievement'],
        required: [true, 'Category is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    image: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        default: 'Admin'
    }
});

module.exports = mongoose.model('News', newsSchema);