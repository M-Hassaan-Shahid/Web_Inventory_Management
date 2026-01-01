const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create sale
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
  try {
    const { items, customerName, customerEmail, paymentMethod } = req.body;

    // Validate stock availability
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        });
      }
    }

    // Calculate totals
    let totalAmount = 0;
    const saleItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
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
      await product.save();
    }

    // Generate sale number
    const saleCount = await Sale.countDocuments();
    const saleNumber = `SALE-${Date.now()}-${saleCount + 1}`;

    const sale = await Sale.create({
      saleNumber,
      items: saleItems,
      totalAmount,
      customerName,
      customerEmail,
      paymentMethod,
      createdBy: req.user._id
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get sale by ID
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('items.product')
      .populate('createdBy', 'name');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getSales,
  createSale,
  getSaleById
};
