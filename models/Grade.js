const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    term: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    subjects: {
        English: { type: Number, default: 0 },
        Kiswahili: { type: Number, default: 0 },
        Mathematics: { type: Number, default: 0 },
        Science: { type: Number, default: 0 },
        'Social Studies': { type: Number, default: 0 },
        CRE: { type: Number, default: 0 },
        'Agriculture & Nutrition': { type: Number, default: 0 },
        'Creative Arts': { type: Number, default: 0 },
        'Digital Literacy': { type: Number, default: 0 },
        French: { type: Number, default: 0 },
        'Pre-Technical Studies': { type: Number, default: 0 }
    },
    total: {
        type: Number,
        default: 0
    },
    average: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Grade', gradeSchema);