const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

dotenv.config();

const migrateCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get an admin user to assign as creator
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('No admin user found. Please create an admin user first.');
            process.exit(1);
        }

        // Old category enum values
        const oldCategories = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Tools', 'Other'];

        // Create new category documents
        const categoryMap = {};
        for (const catName of oldCategories) {
            let category = await Category.findOne({ name: catName });
            if (!category) {
                category = await Category.create({
                    name: catName,
                    description: `${catName} products`,
                    createdBy: adminUser._id
                });
                console.log(`Created category: ${catName}`);
            }
            categoryMap[catName] = category._id;
        }

        // Update all products - Note: This will fail if products still have string categories
        // We need to update the schema first, then run this migration
        console.log('\nMigration complete!');
        console.log('Categories created:', Object.keys(categoryMap).length);
        console.log('\nIMPORTANT: Products with old string categories need manual update.');
        console.log('Run this after updating Product model to use ObjectId reference.');

        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

migrateCategories();
