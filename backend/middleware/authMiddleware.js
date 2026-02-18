const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded:', decoded); // DEBUG

        // Attach user to request
        req.user = await User.findById(decoded.id);
        console.log('👤 User found:', req.user); // DEBUG

        if (!req.user || !req.user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User found with this token is no longer active or does not exist'
            });
        }

        next();
    } catch (err) {
        console.error('❌ Auth error:', err.message); // DEBUG
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
            error: err.message // DEBUG
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        console.log('🔐 Authorization check:'); // DEBUG
        console.log('   User role:', req.user?.role); // DEBUG
        console.log('   Required roles:', roles); // DEBUG

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role "${req.user.role}" is not authorized to access this route. Required: ${roles.join(', ')}`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };