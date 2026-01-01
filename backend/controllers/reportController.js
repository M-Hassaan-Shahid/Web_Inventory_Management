const Sale = require('../models/Sale');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({
        isActive: true,
        $expr: { $lte: ['$quantity', '$minStockLevel'] }
    });

    const totalSales = await Sale.countDocuments({ status: 'completed' });
    const salesRevenue = await Sale.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentSales = await Sale.find()
        .populate('items.product', 'name')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    const topProducts = await Sale.aggregate([
        { $match: { status: 'completed' } },
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.product',
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: { $sum: '$items.total' }
            }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product'
            }
        },
        { $unwind: '$product' }
    ]);

    res.json({
        totalProducts,
        lowStockProducts,
        totalSales,
        totalRevenue: salesRevenue[0]?.total || 0,
        recentSales,
        topProducts
    });
});

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private (Admin/Manager)
const getSalesReport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const matchStage = { status: 'completed' };
    if (startDate && endDate) {
        matchStage.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const salesByDay = await Sale.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const salesByPayment = await Sale.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$paymentMethod',
                count: { $sum: 1 },
                total: { $sum: '$totalAmount' }
            }
        }
    ]);

    res.json({
        salesByDay,
        salesByPayment
    });
});

module.exports = {
    getDashboardStats,
    getSalesReport
};
