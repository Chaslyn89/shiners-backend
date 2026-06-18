const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
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
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    paymentHistory: [{
        date: { type: Date, default: Date.now },
        amount: { type: Number, required: true },
        method: { type: String, default: 'Mpesa' },
        reference: { type: String, default: '' }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Fee', feeSchema);