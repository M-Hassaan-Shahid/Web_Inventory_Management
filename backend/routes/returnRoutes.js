const express = require('express');
const router = express.Router();
const {
    getReturns,
    getReturn,
    createReturn,
    getSaleReturns
} = require('../controllers/returnController');
const { protect } = require('../middleware/auth');
const logActivity = require('../middleware/auditLogger');

router.route('/')
    .get(protect, getReturns)
    .post(protect, logActivity('return'), createReturn);

router.route('/sale/:saleId')
    .get(protect, getSaleReturns);

router.route('/:id')
    .get(protect, getReturn);

module.exports = router;
