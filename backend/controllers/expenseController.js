const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private (Admin/Manager)
const getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate, minAmount, maxAmount, page = 1, limit = 20 } = req.query;

        const query = {};

        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = parseFloat(minAmount);
            if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
        }

        const expenses = await Expense.find(query)
            .populate('createdBy', 'name email')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Expense.countDocuments(query);

        res.json({
            success: true,
            data: expenses,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private (Admin/Manager)
const getExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        res.json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private (Admin/Manager)
const createExpense = async (req, res) => {
    try {
        const { amount, category, date, description, vendor, paymentMethod } = req.body;

        const expense = await Expense.create({
            amount,
            category,
            date,
            description,
            vendor,
            paymentMethod,
            receipt: req.file ? req.file.path : '',
            createdBy: req.user._id
        });

        const populatedExpense = await Expense.findById(expense._id)
            .populate('createdBy', 'name email');

        res.status(201).json({ success: true, data: populatedExpense });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private (Admin/Manager)
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        const { amount, category, date, description, vendor, paymentMethod } = req.body;

        if (amount !== undefined) expense.amount = amount;
        if (category) expense.category = category;
        if (date) expense.date = date;
        if (description) expense.description = description;
        if (vendor !== undefined) expense.vendor = vendor;
        if (paymentMethod) expense.paymentMethod = paymentMethod;
        if (req.file) expense.receipt = req.file.path;

        await expense.save();

        const populatedExpense = await Expense.findById(expense._id)
            .populate('createdBy', 'name email');

        res.json({ success: true, data: populatedExpense });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (Admin/Manager)
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        await expense.deleteOne();

        res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get expense summary
// @route   GET /api/expenses/summary
// @access  Private (Admin/Manager)
const getExpenseSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate);
            if (endDate) matchStage.date.$lte = new Date(endDate);
        }

        const summary = await Expense.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        const totalExpenses = summary.reduce((sum, item) => sum + item.total, 0);

        res.json({
            success: true,
            data: summary,
            totalExpenses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseSummary
};
