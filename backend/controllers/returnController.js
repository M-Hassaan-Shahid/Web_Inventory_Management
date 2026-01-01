const Return = require('../models/Return');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const generateOrderNumber = require('../utils/generateOrderNumber');
const mongoose = require('mongoose');

// @desc    Get all returns
// @route   GET /api/returns
// @access  Private
const getReturns = async (req, res) => {
    try {
        const { reason, refundMethod, startDate, endDate, page = 1, limit = 20 } = req.query;

        const query = {};

        if (reason) query.reason = reason;
        if (refundMethod) query.refundMethod = refundMethod;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const returns = await Return.find(query)
            .populate('sale')
            .populate('items.product', 'name sku')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Return.countDocuments(query);

        res.json({
            success: true,
            data: returns,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single return
// @route   GET /api/returns/:id
// @access  Private
const getReturn = async (req, res) => {
    try {
        const returnDoc = await Return.findById(req.params.id)
            .populate('sale')
            .populate('items.product', 'name sku')
            .populate('createdBy', 'name email');

        if (!returnDoc) {
            return res.status(404).json({ success: false, message: 'Return not found' });
        }

        res.json({ success: true, data: returnDoc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create return
// @route   POST /api/returns
// @access  Private
const createReturn = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { sale, items, reason, reasonDetails, refundMethod } = req.body;

        // Get original sale
        const saleDoc = await Sale.findById(sale).session(session);

        if (!saleDoc) {
            throw new Error('Sale not found');
        }

        if (saleDoc.status === 'cancelled') {
            throw new Error('Cannot return items from cancelled sale');
        }

        // Validate return quantities
        for (const returnItem of items) {
            const saleItem = saleDoc.items.find(
                item => item.product.toString() === returnItem.product.toString()
            );

            if (!saleItem) {
                throw new Error(`Product ${returnItem.product} not found in original sale`);
            }

            // Get existing returns for this sale
            const existingReturns = await Return.find({ sale }).session(session);
            const totalReturned = existingReturns.reduce((sum, ret) => {
                const retItem = ret.items.find(
                    i => i.product.toString() === returnItem.product.toString()
                );
                return sum + (retItem ? retItem.quantity : 0);
            }, 0);

            if (totalReturned + returnItem.quantity > saleItem.quantity) {
                throw new Error(
                    `Return quantity exceeds original sale quantity for product ${returnItem.product}`
                );
            }
        }

        // Calculate totals and update inventory
        const itemsWithTotals = [];
        for (const item of items) {
            const saleItem = saleDoc.items.find(
                si => si.product.toString() === item.product.toString()
            );

            const total = item.quantity * saleItem.price;
            itemsWithTotals.push({
                product: item.product,
                quantity: item.quantity,
                price: saleItem.price,
                total
            });

            // Update product quantity
            const product = await Product.findById(item.product).session(session);
            if (product) {
                product.quantity += item.quantity;
                await product.save({ session });
            }
        }

        const totalRefund = itemsWithTotals.reduce((sum, item) => sum + item.total, 0);

        // Generate return number
        const returnNumber = await generateOrderNumber(Return, 'RET');

        // Create return
        const returnDoc = await Return.create([{
            returnNumber,
            sale,
            items: itemsWithTotals,
            totalRefund,
            reason,
            reasonDetails,
            refundMethod,
            status: 'completed',
            createdBy: req.user._id
        }], { session });

        // Update sale return status
        const allReturns = await Return.find({ sale }).session(session);
        const totalReturnedItems = allReturns.reduce((sum, ret) => {
            return sum + ret.items.reduce((s, i) => s + i.quantity, 0);
        }, 0);

        const totalSaleItems = saleDoc.items.reduce((sum, item) => sum + item.quantity, 0);

        if (totalReturnedItems >= totalSaleItems) {
            saleDoc.returnStatus = 'fully_returned';
        } else {
            saleDoc.returnStatus = 'partially_returned';
        }

        await saleDoc.save({ session });

        await session.commitTransaction();

        const populatedReturn = await Return.findById(returnDoc[0]._id)
            .populate('sale')
            .populate('items.product', 'name sku')
            .populate('createdBy', 'name email');

        res.status(201).json({ success: true, data: populatedReturn });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};

// @desc    Get returns for specific sale
// @route   GET /api/returns/sale/:saleId
// @access  Private
const getSaleReturns = async (req, res) => {
    try {
        const returns = await Return.find({ sale: req.params.saleId })
            .populate('items.product', 'name sku')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: returns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getReturns,
    getReturn,
    createReturn,
    getSaleReturns
};
