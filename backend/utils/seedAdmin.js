const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/users');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// Seed admin user
const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await Admin.findOne({ email: 'admin@alshafii.com' });

        if (adminExists) {
            console.log('ℹ️ Admin user already exists');
            process.exit(0);
        }

        // Create default admin
        const admin = await Admin.create({
            name: 'Admin',
            email: 'admin@alshafii.com',
            password: 'admin123456',
            role: 'super-admin'
        });

        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@alshafii.com');
        console.log('🔑 Password: admin123456');
        console.log('⚠️ Please change the password after first login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
