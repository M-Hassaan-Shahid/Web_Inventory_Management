const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const logActivity = require('../middleware/auditLogger');

router.route('/')
    .get(protect, getCategories)
    .post(protect, authorize('admin', 'manager'), logActivity('category'), createCategory);

router.route('/:id')
    .get(protect, getCategory)
    .put(protect, authorize('admin', 'manager'), logActivity('category'), updateCategory)
    .delete(protect, authorize('admin'), logActivity('category'), deleteCategory);

module.exports = router;
