const express = require('express');
const {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getSuppliers)
    .post(protect, authorize('admin', 'manager'), createSupplier);

router.route('/:id')
    .put(protect, authorize('admin', 'manager'), updateSupplier)
    .delete(protect, authorize('admin'), deleteSupplier);

module.exports = router;
