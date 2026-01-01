const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Expense = require('../models/Expense');
const PurchaseOrder = require('../models/PurchaseOrder');
const exportToCSV = require('../utils/csvExporter');
const exportToPDF = require('../utils/pdfExporter');

const EXPORT_LIMIT = 10000;

// @desc    Export sales report
// @route   GET /api/exports/sales
// @access  Private (Admin/Manager)
const exportSales = async (req, res) => {
    try {
        const { format = 'csv', startDate, endDate } = req.query;

        const query = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const count = await Sale.countDocuments(query);
        if (count > EXPORT_LIMIT) {
            return res.status(400).json({
                success: false,
                message: `Export limit exceeded. Found ${count} records, maximum is ${EXPORT_LIMIT}. Please narrow your date range.`
            });
        }

        const sales = await Sale.find(query)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .limit(EXPORT_LIMIT)
            .lean();

        const data = sales.map(sale => ({
            saleNumber: sale.saleNumber,
            date: new Date(sale.createdAt).toLocaleDateString(),
            customerName: sale.customerName || 'N/A',
            totalAmount: sale.totalAmount.toFixed(2),
            paymentMethod: sale.paymentMethod,
            status: sale.status,
            returnStatus: sale.returnStatus,
            createdBy: sale.createdBy?.name || 'Unknown'
        }));

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `sales-report-${timestamp}`;
        const username = req.user.name || req.user.email;

        if (format === 'pdf') {
            const columns = [
                { header: 'Sale Number', key: 'saleNumber' },
                { header: 'Date', key: 'date' },
                { header: 'Customer', key: 'customerName' },
                { header: 'Amount', key: 'totalAmount' },
                { header: 'Payment', key: 'paymentMethod' },
                { header: 'Status', key: 'status' }
            ];

            const pdfBuffer = await exportToPDF(data, columns, 'Sales Report', username);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
            res.send(pdfBuffer);
        } else {
            const fields = [
                'saleNumber', 'date', 'customerName', 'totalAmount',
                'paymentMethod', 'status', 'returnStatus', 'createdBy'
            ];

            const csv = exportToCSV(data, fields, filename, username);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
            res.send(csv);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Export inventory report
// @route   GET /api/exports/inventory
// @access  Private (Admin/Manager)
const exportInventory = async (req, res) => {
    try {
        const { format = 'csv' } = req.query;

        const count = await Product.countDocuments({ isActive: true });
        if (count > EXPORT_LIMIT) {
            return res.status(400).json({
                success: false,
                message: `Export limit exceeded. Found ${count} records, maximum is ${EXPORT_LIMIT}.`
            });
        }

        const products = await Product.find({ isActive: true })
            .populate('category', 'name')
            .populate('supplier', 'name')
            .sort({ name: 1 })
            .limit(EXPORT_LIMIT)
            .lean();

        const data = products.map(product => ({
            name: product.name,
            sku: product.sku,
            category: product.category?.name || 'N/A',
            quantity: product.quantity,
            minStockLevel: product.minStockLevel,
            price: product.price.toFixed(2),
            costPrice: product.costPrice.toFixed(2),
            supplier: product.supplier?.name || 'N/A',
            status: product.quantity <= product.minStockLevel ? 'Low Stock' : 'In Stock'
        }));

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `inventory-report-${timestamp}`;
        const username = req.user.name || req.user.email;

        if (format === 'pdf') {
            const columns = [
                { header: 'Name', key: 'name' },
                { header: 'SKU', key: 'sku' },
                { header: 'Category', key: 'category' },
                { header: 'Quantity', key: 'quantity' },
                { header: 'Price', key: 'price' },
                { header: 'Status', key: 'status' }
            ];

            const pdfBuffer = await exportToPDF(data, columns, 'Inventory Report', username);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
            res.send(pdfBuffer);
        } else {
            const fields = [
                'name', 'sku', 'category', 'quantity', 'minStockLevel',
                'price', 'costPrice', 'supplier', 'status'
            ];

            const csv = exportToCSV(data, fields, filename, username);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
            res.send(csv);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Export expenses report
// @route   GET /api/exports/expenses
// @access  Private (Admin/Manager)
const exportExpenses = async (req, res) => {
    try {
        const { format = 'csv', startDate, endDate } = req.query;

        const query = {};
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const count = await Expense.countDocuments(query);
        if (count > EXPORT_LIMIT) {
            return res.status(400).json({
                success: false,
                message: `Export limit exceeded. Found ${count} records, maximum is ${EXPORT_LIMIT}. Please narrow your date range.`
            });
        }

        const expenses = await Expense.find(query)
            .populate('createdBy', 'name')
            .sort({ date: -1 })
            .limit(EXPORT_LIMIT)
            .lean();

        const data = expenses.map(expense => ({
            date: new Date(expense.date).toLocaleDateString(),
            category: expense.category,
            amount: expense.amount.toFixed(2),
            description: expense.description,
            vendor: expense.vendor || 'N/A',
            paymentMethod: expense.paymentMethod || 'N/A',
            createdBy: expense.createdBy?.name || 'Unknown'
        }));

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `expenses-report-${timestamp}`;
        const username = req.user.name || req.user.email;

        if (format === 'pdf') {
            const columns = [
                { header: 'Date', key: 'date' },
                { header: 'Category', key: 'category' },
                { header: 'Amount', key: 'amount' },
                { header: 'Description', key: 'description' },
                { header: 'Vendor', key: 'vendor' }
            ];

            const pdfBuffer = await exportToPDF(data, columns, 'Expenses Report', username);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
            res.send(pdfBuffer);
        } else {
            const fields = [
                'date', 'category', 'amount', 'description',
                'vendor', 'paymentMethod', 'createdBy'
            ];

            const csv = exportToCSV(data, fields, filename, username);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
            res.send(csv);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Export purchase orders report
// @route   GET /api/exports/purchase-orders
// @access  Private (Admin/Manager)
const exportPurchaseOrders = async (req, res) => {
    try {
        const { format = 'csv', startDate, endDate } = req.query;

        const query = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const count = await PurchaseOrder.countDocuments(query);
        if (count > EXPORT_LIMIT) {
            return res.status(400).json({
                success: false,
                message: `Export limit exceeded. Found ${count} records, maximum is ${EXPORT_LIMIT}. Please narrow your date range.`
            });
        }

        const orders = await PurchaseOrder.find(query)
            .populate('supplier', 'name')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .limit(EXPORT_LIMIT)
            .lean();

        const data = orders.map(order => ({
            orderNumber: order.orderNumber,
            supplier: order.supplier?.name || 'N/A',
            totalAmount: order.totalAmount.toFixed(2),
            status: order.status,
            expectedDelivery: new Date(order.expectedDeliveryDate).toLocaleDateString(),
            actualDelivery: order.actualDeliveryDate ?
                new Date(order.actualDeliveryDate).toLocaleDateString() : 'N/A',
            createdBy: order.createdBy?.name || 'Unknown'
        }));

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `purchase-orders-report-${timestamp}`;
        const username = req.user.name || req.user.email;

        if (format === 'pdf') {
            const columns = [
                { header: 'Order Number', key: 'orderNumber' },
                { header: 'Supplier', key: 'supplier' },
                { header: 'Amount', key: 'totalAmount' },
                { header: 'Status', key: 'status' },
                { header: 'Expected Delivery', key: 'expectedDelivery' }
            ];

            const pdfBuffer = await exportToPDF(data, columns, 'Purchase Orders Report', username);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
            res.send(pdfBuffer);
        } else {
            const fields = [
                'orderNumber', 'supplier', 'totalAmount', 'status',
                'expectedDelivery', 'actualDelivery', 'createdBy'
            ];

            const csv = exportToCSV(data, fields, filename, username);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
            res.send(csv);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    exportSales,
    exportInventory,
    exportExpenses,
    exportPurchaseOrders
};
