# Inventory Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing inventory, sales, and suppliers for small businesses.

## Features

### Backend

- RESTful API with proper HTTP methods and status codes
- MongoDB with Mongoose ODM including relationships
- JWT-based authentication and authorization
- Role-based access control (Admin, Manager, Staff)
- Data validation and error handling
- Pagination, filtering, and searching
- File upload capability for product images
- Environment variables for configuration

### Frontend

- Responsive design (mobile-friendly)
- State management with Context API
- Form handling with validation
- Protected routes based on user roles
- API integration with Axios
- Clean, modular component structure
- Loading states and user feedback

### Core Functionality

- **User Management**: Register, login, role-based access
- **Product Management**: CRUD operations, stock tracking, low stock alerts
- **Sales Management**: Create sales, track transactions, inventory updates
- **Supplier Management**: Manage supplier information
- **Reports & Dashboard**: Sales analytics, inventory statistics, top products

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads

### Frontend

- React.js
- React Router for navigation
- Context API for state management
- Axios for API calls
- React Icons

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create .env file:

```bash
cp .env.example .env
```

4. Update .env with your configuration:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Start the server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create .env file (optional):

```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm start
```

## API Endpoints

### Authentication

- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile (Protected)

### Products

- GET /api/products - Get all products (with pagination & filters)
- GET /api/products/:id - Get single product
- POST /api/products - Create product (Admin/Manager)
- PUT /api/products/:id - Update product (Admin/Manager)
- DELETE /api/products/:id - Delete product (Admin)

### Sales

- GET /api/sales - Get all sales
- GET /api/sales/:id - Get single sale
- POST /api/sales - Create sale

### Suppliers

- GET /api/suppliers - Get all suppliers
- POST /api/suppliers - Create supplier (Admin/Manager)
- PUT /api/suppliers/:id - Update supplier (Admin/Manager)
- DELETE /api/suppliers/:id - Delete supplier (Admin)

### Reports

- GET /api/reports/dashboard - Get dashboard statistics
- GET /api/reports/sales - Get sales report (Admin/Manager)

## User Roles

- **Admin**: Full access to all features
- **Manager**: Can manage products, suppliers, and view reports
- **Staff**: Can view products, create sales

## Default Test Users

After seeding the database, you can use:

- Admin: admin@example.com / password123
- Manager: manager@example.com / password123
- Staff: staff@example.com / password123

## Deployment

### Backend Deployment (Heroku/Railway)

1. Set environment variables
2. Deploy using Git
3. Ensure MongoDB connection string is configured

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the build folder
3. Set API URL environment variable

## Project Structure

```
inventory-management-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── context/     # Context providers
│       ├── services/    # API services
│       └── App.js       # Main app component
└── README.md
```

## Features Checklist

### Backend

- ✅ RESTful API with proper HTTP methods
- ✅ MongoDB with Mongoose ODM
- ✅ Authentication & Authorization
- ✅ Data validation and error handling
- ✅ File upload capability
- ✅ Pagination, filtering, searching
- ✅ Environment variables

### Frontend

- ✅ Responsive design
- ✅ State management (Context API)
- ✅ Form handling with validation
- ✅ Protected routes
- ✅ API integration
- ✅ Modular component structure
- ✅ Loading states and feedback

## License

MIT

## Author

MERN Stack Developer
