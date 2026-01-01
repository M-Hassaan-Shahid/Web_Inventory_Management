const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all products with pagination and filtering
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { isActive: true };

  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { sku: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.lowStock === 'true') {
    query.$expr = { $lte: ['$quantity', '$minStockLevel'] };
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('supplier', 'name email')
    .populate('category', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('supplier')
    .populate('category', 'name')
    .populate('createdBy', 'name');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin/Manager)
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, supplier, price, costPrice, quantity } = req.body;

  // Validation
  if (!name || !sku || !category || !supplier || price === undefined || costPrice === undefined) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if SKU already exists
  const skuExists = await Product.findOne({ sku });
  if (skuExists) {
    res.status(400);
    throw new Error('Product with this SKU already exists');
  }

  const product = await Product.create({
    ...req.body,
    createdBy: req.user._id
  });

  const populatedProduct = await Product.findById(product._id)
    .populate('supplier', 'name email')
    .populate('category', 'name')
    .populate('createdBy', 'name');

  res.status(201).json(populatedProduct);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Manager)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if updating SKU and if it already exists
  if (req.body.sku && req.body.sku !== product.sku) {
    const skuExists = await Product.findOne({ sku: req.body.sku });
    if (skuExists) {
      res.status(400);
      throw new Error('Product with this SKU already exists');
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('supplier', 'name email')
    .populate('category', 'name')
    .populate('createdBy', 'name');

  res.json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.isActive = false;
  await product.save();

  res.json({ message: 'Product deleted successfully' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
