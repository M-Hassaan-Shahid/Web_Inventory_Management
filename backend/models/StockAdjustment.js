const mongoose = require('mongoose');

const stockAdjustmentSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantityChange: {
        type: Number,
        required: [true, 'Quantity change is required']
    },
    adjustmentType: {
        type: String,
        required: [true, 'Adjustment type is required'],
        enum: ['restock', 'damage', 'loss', 'correction']
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    previousQuantity: {
        type: Number,
        required: true
    },
    newQuantity: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

stockAdjustmentSchema.index({ product: 1, createdAt: -1 });
stockAdjustmentSchema.index({ adjustmentType: 1 });

module.exports = mongoose.model('StockAdjustment', stockAdjustmentSchema);
