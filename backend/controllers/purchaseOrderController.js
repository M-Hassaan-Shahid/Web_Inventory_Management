const PurchaseOrder = require('../models/PurchaseOrder');
const StockAdjustment = require('../models/StockAdjustment');
const Product = require('../models/Product');
const generateOrderNumber = require('../utils/generateOrderNumber');
const mongoose = require('mongoose');

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private (Admin/Manager)
const getPurchaseOrders = async (req, res) => {
    try {
        const { supplier, status, startDate, endDate, page = 1, limit = 20 } = req.query;

        const query = {};

        if (supplier) query.supplier = supplier;
        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const orders = await PurchaseOrder.find(query)
            .populate('supplier', 'name email')
            .populate('items.product', 'name sku')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await PurchaseOrder.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single purchase order
// @route   GET /api/purchase-orders/:id
// @access  Private (Admin/Manager)
const getPurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrder.findById(req.params.id)
            .populate('supplier')
            .populate('items.product', 'name sku')
            .populate('createdBy', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Purchase order not found' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create purchase order
// @route   POST /api/purchase-orders
// @access  Private (Admin/Manager)
const createPurchaseOrder = async (req, res) => {
    try {
        const { supplier, items, expectedDeliveryDate, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one item is required'
            });
        }

        // Calculate totals
        const itemsWithTotals = items.map(item => ({
            ...item,
            total: item.quantity * item.costPrice
        }));

        const totalAmount = itemsWithTotals.reduce((sum, item) => sum + item.total, 0);

        // Generate order number
        const orderNumber = await generateOrderNumber(PurchaseOrder, 'PO');

        const order = await PurchaseOrder.create({
            orderNumber,
            supplier,
            items: itemsWithTotals,
            totalAmount,
            expectedDeliveryDate,
            notes,
            createdBy: req.user._id
        });

        const populatedOrder = await PurchaseOrder.findById(order._id)
            .populate('supplier', 'name email')
            .populate('items.product', 'name sku')
            .populate('createdBy', 'name email');

        res.status(201).json({ success: true, data: populatedOrder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update purchase order
// @route   PUT /api/purchase-orders/:id
// @access  Private (Admin/Manager)
const updatePurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrder.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Purchase order not found' });
        }

        // Prevent editing received or cancelled orders
        if (order.status === 'received' || order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: `Cannot edit ${order.status} purchase orders`
            });
        }

        const { supplier, items, expectedDeliveryDate, notes } = req.body;

        if (supplier) order.supplier = supplier;
        if (expectedDeliveryDate) order.expectedDeliveryDate = expectedDeliveryDate;
        if (notes !== undefined) order.notes = notes;

        if (items && items.length > 0) {
            const itemsWithTotals = items.map(item => ({
                ...item,
                total: item.quantity * item.costPrice
            }));
            order.items = itemsWithTotals;
            order.totalAmount = itemsWithTotals.reduce((sum, item) => sum + item.total, 0);
        }

        await order.save();

        const populatedOrder = await PurchaseOrder.findById(order._id)
            .populate('supplier', 'name email')
            .populate('items.product', 'name sku')
            .populate('createdBy', 'name email');

        res.json({ success: true, data: populatedOrder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update purchase order status
// @route   PATCH /api/purchase-orders/:id/status
// @access  Private (Admin/Manager)
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await PurchaseOrder.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Purchase order not found' });
        }

        order.status = status;
        await order.save();

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Receive purchase order
// @route   POST /api/purchase-orders/:id/receive
// @access  Private (Admin/Manager)
const receiveOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await PurchaseOrder.findById(req.params.id).session(session);

        if (!order) {
            throw new Error('Purchase order not found');
        }

        if (order.status === 'received') {
            throw new Error('Purchase order already received');
        }

        // Create stock adjustments for all items
        const adjustments = [];
        for (const item of order.items) {
            const product = await Product.findById(item.product).session(session);

            if (!product) {
                throw new Error(`Product ${item.product} not found`);
            }

            const previousQuantity = product.quantity;
            const newQuantity = previousQuantity + item.quantity;

            const adjustment = await StockAdjustment.create([{
                product: item.product,
                quantityChange: item.quantity,
                adjustmentType: 'restock',
                reason: `Purchase order ${order.orderNumber} received`,
                previousQuantity,
                newQuantity,
                createdBy: req.user._id
            }], { session });

            product.quantity = newQuantity;
            await product.save({ session });

            adjustments.push(adjustment[0]);
        }

        // Update order status
        order.status = 'received';
        order.actualDeliveryDate = new Date();
        await order.save({ session });

        await session.commitTransaction();

        const populatedOrder = await PurchaseOrder.findById(order._id)
            .populate('supplier', 'name email')
            .populate('items.product', 'name sku')
            .populate('createdBy', 'name email');

        res.json({
            success: true,
            data: populatedOrder,
            adjustments: adjustments.length
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};

module.exports = {
    getPurchaseOrders,
    getPurchaseOrder,
    createPurchaseOrder,
    updatePurchaseOrder,
    updateStatus,
    receiveOrder
};
