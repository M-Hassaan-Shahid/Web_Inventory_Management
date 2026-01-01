const ActivityLog = require('../models/ActivityLog');

// @desc    Get all activity logs
// @route   GET /api/activity-logs
// @access  Private (Admin)
const getActivityLogs = async (req, res) => {
    try {
        const { user, action, entityType, startDate, endDate, search, page = 1, limit = 50 } = req.query;

        const query = {};

        if (user) query.user = user;
        if (action) query.action = action;
        if (entityType) query.entityType = entityType;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        // Simple search on entityId
        if (search) {
            query.entityId = search;
        }

        const logs = await ActivityLog.find(query)
            .populate('user', 'name email')
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await ActivityLog.countDocuments(query);

        res.json({
            success: true,
            data: logs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single activity log
// @route   GET /api/activity-logs/:id
// @access  Private (Admin)
const getActivityLog = async (req, res) => {
    try {
        const log = await ActivityLog.findById(req.params.id)
            .populate('user', 'name email');

        if (!log) {
            return res.status(404).json({ success: false, message: 'Activity log not found' });
        }

        res.json({ success: true, data: log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getActivityLogs,
    getActivityLog
};
