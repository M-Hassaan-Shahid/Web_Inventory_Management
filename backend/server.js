const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const requestLogger = require('./middleware/requestLogger');
const {
    helmet,
    apiLimiter,
    sanitizeData,
    preventParamPollution
} = require('./middleware/security');

dotenv.config();

connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(sanitizeData);

// Prevent parameter pollution
app.use(preventParamPollution);

// Request logging
if (process.env.NODE_ENV === 'development') {
    app.use(requestLogger);
}

// Static files
app.use('/uploads', express.static('uploads'));

// Rate limiting for API
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/stock-adjustments', require('./routes/stockAdjustmentRoutes'));
app.use('/api/purchase-orders', require('./routes/purchaseOrderRoutes'));
app.use('/api/returns', require('./routes/returnRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/activity-logs', require('./routes/activityLogRoutes'));
app.use('/api/exports', require('./routes/exportRoutes'));

app.get('/', (req, res) => {
    res.json({
        message: 'Inventory Management API',
        version: '1.0.0',
        status: 'running'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
