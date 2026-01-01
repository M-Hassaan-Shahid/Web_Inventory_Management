const express = require('express');
const { getDashboardStats, getSalesReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/sales', protect, authorize('admin', 'manager'), getSalesReport);

module.exports = router;
