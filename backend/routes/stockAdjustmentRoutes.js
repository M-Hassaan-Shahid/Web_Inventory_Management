const express = require('express');
const router = express.Router();
const {
    getStockAdjustments,
    getStockAdjustment,
    createStockAdjustment,
    getProductAdjustments
} = require('../controllers/stockAdjustmentController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/auditLogger');

router.route('/')
    .get(protect, authorize('admin', 'manager'), getStockAdjustments)
    .post(protect, authorize('admin', 'manager'), logActivity('stock_adjustment'), createStockAdjustment);

router.route('/product/:productId')
    .get(protect, authorize('admin', 'manager'), getProductAdjustments);

router.route('/:id')
    .get(protect, authorize('admin', 'manager'), getStockAdjustment);

module.exports = router;
