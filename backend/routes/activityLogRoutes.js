const express = require('express');
const router = express.Router();
const {
    getActivityLogs,
    getActivityLog
} = require('../controllers/activityLogController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('admin'), getActivityLogs);

router.route('/:id')
    .get(protect, authorize('admin'), getActivityLog);

module.exports = router;
