const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const discountRoutes = require('./routes/discountRoutes');
const { initializeTelegramBot } = require('./services/telegramBot');

// Load environment variables
dotenv.config();

const app = express();

// ============ MIDDLEWARE ============

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000','https://al-shafi-i-foundation.vercel.app',],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ============ DATABASE CONNECTION ============

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        initializeTelegramBot();
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ============ ROUTES ============

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Register routes with correct paths
app.use('/api/auth', authRoutes);      // For auth endpoints: /api/auth/login, /api/auth/register
app.use('/api', productRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/analytics', analyticsRoutes);
// For product endpoints: /api/products, /api/admin/products

// Optional: User routes if you have them
// app.use('/api/users', userRoutes);

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date()
    });
});

// ============ ERROR HANDLING ============

// 404 - Not Found
app.use((req, res) => {
    console.log(`404 Error: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║  Server is running on port ${PORT}       ║
    ║  Environment: ${process.env.NODE_ENV}          ║
    ║  API Base: http://localhost:${PORT}/api ║
    ╚════════════════════════════════════════╝
    `);
});