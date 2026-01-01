const express = require('express');
const { getSales, createSale, getSaleById } = require('../controllers/saleController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getSales)
    .post(protect, createSale);

router.route('/:id')
    .get(protect, getSaleById);

module.exports = router;
