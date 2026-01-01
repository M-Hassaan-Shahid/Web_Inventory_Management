const Supplier = require('../models/Supplier');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { isActive: true };

  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const total = await Supplier.countDocuments(query);
  const suppliers = await Supplier.find(query)
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    suppliers,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private (Admin/Manager)
const createSupplier = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  // Validation
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if email already exists
  const emailExists = await Supplier.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error('Supplier with this email already exists');
  }

  const supplier = await Supplier.create({
    ...req.body,
    createdBy: req.user._id
  });

  const populatedSupplier = await Supplier.findById(supplier._id)
    .populate('createdBy', 'name');

  res.status(201).json(populatedSupplier);
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private (Admin/Manager)
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  // Check if updating email and if it already exists
  if (req.body.email && req.body.email !== supplier.email) {
    const emailExists = await Supplier.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400);
      throw new Error('Supplier with this email already exists');
    }
  }

  const updatedSupplier = await Supplier.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('createdBy', 'name');

  res.json(updatedSupplier);
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private (Admin)
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }

  supplier.isActive = false;
  await supplier.save();

  res.json({ message: 'Supplier deleted successfully' });
});

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
