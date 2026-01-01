const express = require('express');
const router = express.Router();
const {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseSummary
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const logActivity = require('../middleware/auditLogger');

router.route('/summary')
    .get(protect, authorize('admin', 'manager'), getExpenseSummary);

router.route('/')
    .get(protect, authorize('admin', 'manager'), getExpenses)
    .post(protect, authorize('admin', 'manager'), upload.single('receipt'), logActivity('expense'), createExpense);

router.route('/:id')
    .get(protect, authorize('admin', 'manager'), getExpense)
    .put(protect, authorize('admin', 'manager'), upload.single('receipt'), logActivity('expense'), updateExpense)
    .delete(protect, authorize('admin', 'manager'), logActivity('expense'), deleteExpense);

module.exports = router;
