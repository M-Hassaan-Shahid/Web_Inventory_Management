const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: 'Too many authentication attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting for general API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Sanitize data to prevent NoSQL injection
const sanitizeData = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized key: ${key} in request from ${req.ip}`);
    },
});

// Prevent parameter pollution
const preventParamPollution = hpp({
    whitelist: [
        'page',
        'limit',
        'sort',
        'category',
        'status',
        'paymentMethod',
        'startDate',
        'endDate'
    ]
});

module.exports = {
    authLimiter,
    apiLimiter,
    helmet,
    sanitizeData,
    preventParamPollution
};
