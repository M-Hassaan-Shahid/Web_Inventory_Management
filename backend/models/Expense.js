const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be positive']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['rent', 'utilities', 'salaries', 'marketing', 'maintenance', 'other']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    receipt: {
        type: String,
        default: ''
    },
    vendor: {
        type: String,
        trim: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'bank_transfer', 'check']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

expenseSchema.index({ category: 1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
