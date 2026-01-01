const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const returnSchema = new mongoose.Schema({
    returnNumber: {
        type: String,
        required: true,
        unique: true
    },
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    items: [returnItemSchema],
    totalRefund: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        enum: ['defective', 'wrong_item', 'customer_request', 'other'],
        required: true
    },
    reasonDetails: {
        type: String,
        trim: true
    },
    refundMethod: {
        type: String,
        enum: ['cash', 'card', 'store_credit'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'completed'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

returnSchema.index({ returnNumber: 1 });
returnSchema.index({ sale: 1 });
returnSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Return', returnSchema);
