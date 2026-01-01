# Changelog

All notable changes to the backend of the Inventory Management System.

## [1.1.0] - 2026-01-01

### Added - Security Features

- **Rate Limiting**: Added express-rate-limit for authentication (5 req/15min) and API endpoints (100 req/15min)
- **Security Headers**: Implemented Helmet.js for secure HTTP headers
- **NoSQL Injection Prevention**: Added express-mongo-sanitize to sanitize user input
- **Parameter Pollution Prevention**: Implemented hpp middleware
- **Request Logger**: Added comprehensive request/response logging for development
- **Async Error Handler**: Created asyncHandler wrapper for consistent error handling
- **404 Handler**: Added notFound middleware for undefined routes
- **Health Check Endpoint**: Added /health endpoint for monitoring

### Added - Error Handling Improvements

- Enhanced error handler with specific error types (JWT, Multer, Mongoose)
- Consistent error response format across all endpoints
- Stack traces only shown in development mode
- Better error messages for validation failures
- Async/await error handling in all controllers

### Added - Validation & Security

- Input validation in auth controller (email, password, required fields)
- SKU uniqueness validation in product creation/update
- Email uniqueness validation in supplier creation/update
- Stock availability validation in sales with proper error messages
- Account status check during authentication
- User existence validation in protected routes

### Fixed - Critical Issues

- **Migration Bug**: Fixed MONGO_URI to MONGODB_URI in migrateCategories.js
- **Import Bug**: Fixed upload middleware import in expenseRoutes.js (removed destructuring)
- **Missing Directory**: Created uploads/ directory with .gitkeep
- **CORS Configuration**: Restricted CORS to specific frontend URL instead of allowing all origins
- **Transaction Handling**: Added proper MongoDB transactions in sale creation

### Changed - Controllers

- Refactored all controllers to use asyncHandler wrapper
- Removed try-catch blocks in favor of centralized error handling
- Added proper validation before database operations
- Improved error messages with specific details
- Added population of related fields in responses

### Changed - Middleware

- Enhanced auth middleware with better error handling
- Added user active status check in protect middleware
- Improved authorize middleware with better error messages
- Updated security middleware with comprehensive configuration

### Changed - Configuration

- Updated server.js with security middleware stack
- Added FRONTEND_URL environment variable
- Enhanced CORS configuration with credentials support
- Added request body size limits (10mb)
- Improved error handler with more error types

### Changed - Documentation

- Updated .env.example with new environment variables
- Created SECURITY.md with comprehensive security documentation
- Updated .gitignore to properly handle uploads directory
- Added security checklist and best practices

### Security Improvements

- JWT secret strength requirements documented
- Rate limiting on authentication endpoints prevents brute force
- NoSQL injection attacks prevented via sanitization
- XSS protection via security headers
- CSRF protection via CORS configuration
- File upload restrictions (type and size)
- Audit logging for all operations

### Performance

- Added request logging with response time tracking
- Optimized error handling to reduce overhead
- Improved database query efficiency with proper population

## [1.0.0] - Initial Release

### Features

- User authentication with JWT
- Role-based access control (Admin, Manager, Staff)
- Product management with categories
- Supplier management
- Sales processing with inventory deduction
- Purchase order management
- Stock adjustments
- Returns processing
- Expense tracking
- Activity logging
- Dashboard statistics
- Sales reports
- Export functionality (CSV/PDF)
- File upload for product images and receipts

### Database Models

- User
- Product
- Category
- Supplier
- Sale
- PurchaseOrder
- Return
- StockAdjustment
- Expense
- ActivityLog

### API Endpoints

- Authentication: /api/auth
- Products: /api/products
- Categories: /api/categories
- Suppliers: /api/suppliers
- Sales: /api/sales
- Purchase Orders: /api/purchase-orders
- Returns: /api/returns
- Stock Adjustments: /api/stock-adjustments
- Expenses: /api/expenses
- Reports: /api/reports
- Exports: /api/exports
- Activity Logs: /api/activity-logs
