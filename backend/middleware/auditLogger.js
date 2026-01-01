const ActivityLog = require('../models/ActivityLog');

const logActivity = (entityType) => {
    return async (req, res, next) => {
        // Store original methods
        const originalJson = res.json;
        const originalSend = res.send;

        // Override res.json
        res.json = function (data) {
            // Only log successful operations
            if (res.statusCode >= 200 && res.statusCode < 300 && data.success !== false) {
                logToDatabase(req, entityType, data);
            }
            return originalJson.call(this, data);
        };

        // Override res.send
        res.send = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
                    if (jsonData.success !== false) {
                        logToDatabase(req, entityType, jsonData);
                    }
                } catch (e) {
                    // Not JSON, skip logging
                }
            }
            return originalSend.call(this, data);
        };

        next();
    };
};

const logToDatabase = async (req, entityType, responseData) => {
    try {
        if (!req.user) return;

        let action = null;
        let entityId = null;
        let changes = {};

        // Determine action based on HTTP method and route
        if (req.method === 'POST') {
            action = 'create';
            entityId = responseData.data?._id;
            changes.new = responseData.data;
        } else if (req.method === 'PUT' || req.method === 'PATCH') {
            action = 'update';
            entityId = req.params.id;
            changes.new = responseData.data;
            // Old data would need to be captured before the update
            // For simplicity, we're only storing new data
        } else if (req.method === 'DELETE') {
            action = 'delete';
            entityId = req.params.id;
        }

        if (action && entityId) {
            await ActivityLog.create({
                user: req.user._id,
                action,
                entityType,
                entityId,
                changes,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('user-agent'),
                timestamp: new Date()
            });
        }
    } catch (error) {
        // Log error but don't block the response
        console.error('Activity logging error:', error.message);
    }
};

module.exports = logActivity;
