const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Supplier.deleteMany({});
        await Product.deleteMany({});

        // Create Admin User
        console.log('Creating admin user...');
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@inventory.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✅ Admin created: admin@inventory.com / admin123');

        // Create Manager User
        const manager = await User.create({
            name: 'Manager User',
            email: 'manager@inventory.com',
            password: 'manager123',
            role: 'manager'
        });
        console.log('✅ Manager created: manager@inventory.com / manager123');

        // Create Staff User
        const staff = await User.create({
            name: 'Staff User',
            email: 'staff@inventory.com',
            password: 'staff123',
            role: 'staff'
        });
        console.log('✅ Staff created: staff@inventory.com / staff123');

        // Create Suppliers
        console.log('\nCreating suppliers...');
        const supplier1 = await Supplier.create({
            name: 'Tech Supplies Inc',
            email: 'contact@techsupplies.com',
            phone: '+1-555-0101',
            contactPerson: 'John Smith',
            address: {
                street: '123 Tech Street',
                city: 'San Francisco',
                state: 'CA',
                zipCode: '94102',
                country: 'USA'
            },
            createdBy: admin._id
        });

        const supplier2 = await Supplier.create({
            name: 'Global Electronics',
            email: 'sales@globalelectronics.com',
            phone: '+1-555-0202',
            contactPerson: 'Sarah Johnson',
            address: {
                street: '456 Commerce Ave',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA'
            },
            createdBy: admin._id
        });

        const supplier3 = await Supplier.create({
            name: 'Office Essentials',
            email: 'info@officeessentials.com',
            phone: '+1-555-0303',
            contactPerson: 'Mike Davis',
            address: {
                street: '789 Business Blvd',
                city: 'Chicago',
                state: 'IL',
                zipCode: '60601',
                country: 'USA'
            },
            createdBy: admin._id
        });

        console.log('✅ 3 suppliers created');

        // Create Products
        console.log('\nCreating products...');
        const products = [
            {
                name: 'Laptop Dell XPS 15',
                sku: 'DELL-XPS-15-001',
                description: 'High-performance laptop with 16GB RAM and 512GB SSD',
                category: 'Electronics',
                quantity: 25,
                minStockLevel: 5,
                price: 1299.99,
                costPrice: 999.99,
                supplier: supplier1._id,
                createdBy: admin._id
            },
            {
                name: 'iPhone 14 Pro',
                sku: 'APPLE-IP14P-001',
                description: '256GB, Space Black',
                category: 'Electronics',
                quantity: 15,
                minStockLevel: 10,
                price: 1099.99,
                costPrice: 899.99,
                supplier: supplier2._id,
                createdBy: admin._id
            },
            {
                name: 'Samsung 4K Monitor',
                sku: 'SAMS-MON-4K-001',
                description: '32-inch 4K UHD Monitor',
                category: 'Electronics',
                quantity: 30,
                minStockLevel: 8,
                price: 449.99,
                costPrice: 349.99,
                supplier: supplier2._id,
                createdBy: admin._id
            },
            {
                name: 'Office Chair Ergonomic',
                sku: 'FURN-CHAIR-001',
                description: 'Comfortable ergonomic office chair with lumbar support',
                category: 'Furniture',
                quantity: 20,
                minStockLevel: 5,
                price: 299.99,
                costPrice: 199.99,
                supplier: supplier3._id,
                createdBy: admin._id
            },
            {
                name: 'Wireless Mouse Logitech',
                sku: 'LOGI-MOUSE-001',
                description: 'Wireless mouse with precision tracking',
                category: 'Electronics',
                quantity: 50,
                minStockLevel: 15,
                price: 29.99,
                costPrice: 19.99,
                supplier: supplier1._id,
                createdBy: admin._id
            },
            {
                name: 'Mechanical Keyboard',
                sku: 'KEYB-MECH-001',
                description: 'RGB mechanical keyboard with blue switches',
                category: 'Electronics',
                quantity: 35,
                minStockLevel: 10,
                price: 89.99,
                costPrice: 59.99,
                supplier: supplier1._id,
                createdBy: admin._id
            },
            {
                name: 'Standing Desk',
                sku: 'FURN-DESK-001',
                description: 'Adjustable height standing desk',
                category: 'Furniture',
                quantity: 12,
                minStockLevel: 3,
                price: 599.99,
                costPrice: 449.99,
                supplier: supplier3._id,
                createdBy: admin._id
            },
            {
                name: 'Webcam HD 1080p',
                sku: 'CAM-HD-001',
                description: 'Full HD webcam with auto-focus',
                category: 'Electronics',
                quantity: 40,
                minStockLevel: 12,
                price: 79.99,
                costPrice: 49.99,
                supplier: supplier2._id,
                createdBy: admin._id
            },
            {
                name: 'USB-C Hub',
                sku: 'HUB-USBC-001',
                description: '7-in-1 USB-C hub with HDMI and card reader',
                category: 'Electronics',
                quantity: 60,
                minStockLevel: 20,
                price: 39.99,
                costPrice: 24.99,
                supplier: supplier1._id,
                createdBy: admin._id
            },
            {
                name: 'Desk Lamp LED',
                sku: 'LAMP-LED-001',
                description: 'Adjustable LED desk lamp with touch control',
                category: 'Other',
                quantity: 8,
                minStockLevel: 10,
                price: 49.99,
                costPrice: 29.99,
                supplier: supplier3._id,
                createdBy: admin._id
            }
        ];

        await Product.insertMany(products);
        console.log('✅ 10 products created');

        console.log('\n========================================');
        console.log('✅ Database seeded successfully!');
        console.log('========================================');
        console.log('\n📝 Login Credentials:');
        console.log('\n👑 ADMIN:');
        console.log('   Email: admin@inventory.com');
        console.log('   Password: admin123');
        console.log('\n👔 MANAGER:');
        console.log('   Email: manager@inventory.com');
        console.log('   Password: manager123');
        console.log('\n👤 STAFF:');
        console.log('   Email: staff@inventory.com');
        console.log('   Password: staff123');
        console.log('\n========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
