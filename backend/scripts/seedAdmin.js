const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('❌ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
            process.exit(1);
        }

        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('ℹ️ Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        const admin = await User.create({
            fullName: 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        console.log('✅ Admin user created successfully');
        console.log('Email:', admin.email);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
