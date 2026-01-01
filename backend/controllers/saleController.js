const Sale = require('../models/Sale');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const total = await Sale.countDocuments(query);
  const sales = await Sale.find(query)
    .populate('items.product', 'name sku')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    sales,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create sale
// @route   POST /api/sales
// @access  Private
const createSale = asyncHandler(async (req, res) => {
  const { items, customerName, customerEmail, paymentMethod } = req.body;

  // Validation
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('At least one item is required');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate stock availability
    for (let item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      if (!product.isActive) {
        throw new Error(`Product ${product.name} is not active`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
        );
      }
    }

    // Calculate totals and prepare sale items
    let totalAmount = 0;
    const saleItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product).session(session);
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      saleItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save({ session });
    }

    // Generate sale number
    const saleCount = await Sale.countDocuments();
    const saleNumber = `SALE-${Date.now()}-${saleCount + 1}`;

    const sale = await Sale.create([{
      saleNumber,
      items: saleItems,
      totalAmount,
      customerName,
      customerEmail,
      paymentMethod: paymentMethod || 'cash',
      createdBy: req.user._id
    }], { session });

    await session.commitTransaction();

    const populatedSale = await Sale.findById(sale[0]._id)
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name');

    res.status(201).json(populatedSale);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// @desc    Get sale by ID
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id)
    .populate('items.product')
    .populate('createdBy', 'name');

  if (!sale) {
    res.status(404);
    throw new Error('Sale not found');
  }

  res.json(sale);
});

module.exports = {
  getSales,
  createSale,
  getSaleById
};
