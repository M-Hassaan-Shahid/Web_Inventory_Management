const express = require('express');
const router = express.Router();
const {
    exportSales,
    exportInventory,
    exportExpenses,
    exportPurchaseOrders
} = require('../controllers/exportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/sales', protect, authorize('admin', 'manager'), exportSales);
router.get('/inventory', protect, authorize('admin', 'manager'), exportInventory);
router.get('/expenses', protect, authorize('admin', 'manager'), exportExpenses);
router.get('/purchase-orders', protect, authorize('admin', 'manager'), exportPurchaseOrders);

module.exports = router;
