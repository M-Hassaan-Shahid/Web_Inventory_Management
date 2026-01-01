# Inventory Management System

A full-stack MERN (MongoDB, Express, React, Node.js) inventory management system with role-based access control, real-time inventory tracking, and comprehensive reporting features.

## ✨ Features

### Core Functionality

- 📦 **Product Management** - Add, edit, delete, and track products
- 🏷️ **Category Management** - Organize products by categories
- 🏢 **Supplier Management** - Manage supplier information
- 💰 **Sales Processing** - Create sales with automatic inventory deduction
- 📋 **Purchase Orders** - Create and manage purchase orders
- 🔄 **Returns Processing** - Handle product returns with inventory restoration
- 📊 **Stock Adjustments** - Manual inventory adjustments with audit trail
- 💸 **Expense Tracking** - Track business expenses by category
- 📈 **Reports & Analytics** - Dashboard with sales and inventory insights
- 📤 **Export Functionality** - Export data to CSV and PDF

### Security & Access Control

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access** - Admin, Manager, and Staff roles
- 🛡️ **Rate Limiting** - Protection against brute force attacks
- 🔒 **Input Sanitization** - NoSQL injection prevention
- 🎯 **CORS Protection** - Configured for specific origins
- 📝 **Activity Logging** - Complete audit trail of all operations

### User Experience

- 🎨 **Modern UI** - Clean, professional interface
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Optimized for speed
- 🔍 **Search & Filter** - Easy data discovery
- 📄 **Pagination** - Efficient data loading
- 🎯 **Real-time Updates** - Instant inventory updates

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- MongoDB (local or Atlas)
- Git

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/inventory-management.git
   cd inventory-management
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run seed  # Optional: seed database with sample data
   npm run dev
   ```

3. **Setup Frontend**

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Default Login Credentials

After seeding the database:

- **Admin**: admin@inventory.com / admin123
- **Manager**: manager@inventory.com / manager123
- **Staff**: staff@inventory.com / staff123

## 🌐 Free Deployment

Deploy both frontend and backend completely free! See our deployment guides:

- **Quick Deploy (5 minutes)**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **Detailed Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Recommended Free Hosting

- **Backend**: Render.com (Free tier)
- **Database**: MongoDB Atlas (Free 512MB)
- **Frontend**: Vercel or Netlify (Free tier)

**Total Cost: $0/month** 💰

## 📁 Project Structure

```
inventory-management/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── uploads/            # File uploads
│   └── server.js           # Entry point
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   └── package.json
├── DEPLOYMENT_GUIDE.md    # Detailed deployment guide
├── QUICK_DEPLOY.md        # Quick deployment guide
└── README.md              # This file
```

## 🔧 Technology Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, express-rate-limit, mongo-sanitize, hpp
- **File Upload**: Multer
- **Export**: json2csv, PDFKit
- **Validation**: express-validator

### Frontend

- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with CSS Variables
- **State Management**: Context API

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/profile     - Get user profile
```

### Product Endpoints

```
GET    /api/products         - Get all products (with pagination)
GET    /api/products/:id     - Get single product
POST   /api/products         - Create product (Admin/Manager)
PUT    /api/products/:id     - Update product (Admin/Manager)
DELETE /api/products/:id     - Delete product (Admin)
```

### Sales Endpoints

```
GET    /api/sales            - Get all sales
GET    /api/sales/:id        - Get single sale
POST   /api/sales            - Create sale
```

### Additional Endpoints

- Categories: `/api/categories`
- Suppliers: `/api/suppliers`
- Purchase Orders: `/api/purchase-orders`
- Returns: `/api/returns`
- Stock Adjustments: `/api/stock-adjustments`
- Expenses: `/api/expenses`
- Reports: `/api/reports`
- Exports: `/api/exports`
- Activity Logs: `/api/activity-logs`

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting on authentication endpoints
- ✅ NoSQL injection prevention
- ✅ XSS protection via Helmet
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Activity logging and audit trail
- ✅ Secure file upload handling

See [backend/SECURITY.md](backend/SECURITY.md) for detailed security documentation.

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## 📊 Database Schema

### Main Collections

- **Users** - User accounts with roles
- **Products** - Product inventory
- **Categories** - Product categories
- **Suppliers** - Supplier information
- **Sales** - Sales transactions
- **PurchaseOrders** - Purchase orders
- **Returns** - Product returns
- **StockAdjustments** - Inventory adjustments
- **Expenses** - Business expenses
- **ActivityLogs** - Audit trail

## 🎨 Theme

The application features a clean, professional light theme with:

- Indigo blue primary color (#4f46e5)
- Light backgrounds for better readability
- Subtle shadows and transitions
- Responsive design for all devices

See [FRONTEND_THEME_UPDATE.md](FRONTEND_THEME_UPDATE.md) for theme details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- MongoDB Atlas for free database hosting
- Render.com for free backend hosting
- Vercel for free frontend hosting
- All open-source contributors

## 🗺️ Roadmap

- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Barcode scanning
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication
- [ ] Automated backup system

## 📈 Changelog

See [backend/CHANGELOG.md](backend/CHANGELOG.md) for version history and changes.

---

**Built with ❤️ using the MERN stack**
