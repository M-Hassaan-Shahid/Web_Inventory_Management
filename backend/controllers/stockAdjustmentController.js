const StockAdjustment = require('../models/StockAdjustment');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get all stock adjustments
// @route   GET /api/stock-adjustments
// @access  Private (Admin/Manager)
const getStockAdjustments = async (req, res) => {
    try {
        const { product, adjustmentType, startDate, endDate, page = 1, limit = 20 } = req.query;

        const query = {};

        if (product) query.product = product;
        if (adjustmentType) query.adjustmentType = adjustmentType;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const adjustments = await StockAdjustment.find(query)
            .populate('product', 'name sku')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await StockAdjustment.countDocuments(query);

        res.json({
            success: true,
            data: adjustments,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single stock adjustment
// @route   GET /api/stock-adjustments/:id
// @access  Private (Admin/Manager)
const getStockAdjustment = async (req, res) => {
    try {
        const adjustment = await StockAdjustment.findById(req.params.id)
            .populate('product', 'name sku')
            .populate('createdBy', 'name email');

        if (!adjustment) {
            return res.status(404).json({ success: false, message: 'Stock adjustment not found' });
        }

        res.json({ success: true, data: adjustment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create stock adjustment
// @route   POST /api/stock-adjustments
// @access  Private (Admin/Manager)
const createStockAdjustment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { product, quantityChange, adjustmentType, reason, notes } = req.body;

        // Validate adjustment type and quantity sign
        if (adjustmentType === 'restock' && quantityChange <= 0) {
            throw new Error('Restock adjustments must have positive quantity');
        }
        if ((adjustmentType === 'damage' || adjustmentType === 'loss') && quantityChange >= 0) {
            throw new Error('Damage and loss adjustments must have negative quantity');
        }

        // Get product
        const productDoc = await Product.findById(product).session(session);

        if (!productDoc) {
            throw new Error('Product not found');
        }

        const previousQuantity = productDoc.quantity;
        const newQuantity = previousQuantity + quantityChange;

        // Validate new quantity is not negative
        if (newQuantity < 0) {
            throw new Error('Adjustment would result in negative inventory');
        }

        // Create adjustment
        const adjustment = await StockAdjustment.create([{
            product,
            quantityChange,
            adjustmentType,
            reason,
            notes,
            previousQuantity,
            newQuantity,
            createdBy: req.user._id
        }], { session });

        // Update product quantity
        productDoc.quantity = newQuantity;
        await productDoc.save({ session });

        await session.commitTransaction();

        const populatedAdjustment = await StockAdjustment.findById(adjustment[0]._id)
            .populate('product', 'name sku')
            .populate('createdBy', 'name email');

        res.status(201).json({ success: true, data: populatedAdjustment });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};

// @desc    Get adjustments for specific product
// @route   GET /api/stock-adjustments/product/:productId
// @access  Private (Admin/Manager)
const getProductAdjustments = async (req, res) => {
    try {
        const adjustments = await StockAdjustment.find({ product: req.params.productId })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.quantityChange, 0);

        res.json({
            success: true,
            data: adjustments,
            totalAdjustment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getStockAdjustments,
    getStockAdjustment,
    createStockAdjustment,
    getProductAdjustments
};
