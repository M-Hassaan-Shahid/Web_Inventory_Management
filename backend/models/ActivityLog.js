const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['create', 'update', 'delete'],
        required: true
    },
    entityType: {
        type: String,
        enum: ['product', 'sale', 'return', 'purchase_order', 'stock_adjustment', 'expense', 'supplier', 'category', 'user'],
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    changes: {
        old: mongoose.Schema.Types.Mixed,
        new: mongoose.Schema.Types.Mixed
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: false
});

activityLogSchema.index({ user: 1 });
activityLogSchema.index({ entityType: 1 });
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ action: 1 });

// Prevent updates and deletes
activityLogSchema.pre('findOneAndUpdate', function (next) {
    next(new Error('Activity logs cannot be updated'));
});

activityLogSchema.pre('findOneAndDelete', function (next) {
    next(new Error('Activity logs cannot be deleted'));
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
