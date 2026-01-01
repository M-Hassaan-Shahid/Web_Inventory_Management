const express = require('express');
const router = express.Router();
const {
    getPurchaseOrders,
    getPurchaseOrder,
    createPurchaseOrder,
    updatePurchaseOrder,
    updateStatus,
    receiveOrder
} = require('../controllers/purchaseOrderController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/auditLogger');

router.route('/')
    .get(protect, authorize('admin', 'manager'), getPurchaseOrders)
    .post(protect, authorize('admin', 'manager'), logActivity('purchase_order'), createPurchaseOrder);

router.route('/:id')
    .get(protect, authorize('admin', 'manager'), getPurchaseOrder)
    .put(protect, authorize('admin', 'manager'), logActivity('purchase_order'), updatePurchaseOrder);

router.route('/:id/status')
    .patch(protect, authorize('admin', 'manager'), logActivity('purchase_order'), updateStatus);

router.route('/:id/receive')
    .post(protect, authorize('admin', 'manager'), logActivity('purchase_order'), receiveOrder);

module.exports = router;
