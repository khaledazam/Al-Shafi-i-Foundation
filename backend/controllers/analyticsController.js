const Simulation = require('../models/Simulation');
const Product = require('../models/Product');

// @desc    Get popular colors (most selected in simulations)
// @route   GET /api/analytics/popular-colors
// @access  Private (Admin)
exports.getPopularColors = async (req, res) => {
    try {
        const colorStats = await Simulation.aggregate([
            { $unwind: '$selectedColors' },
            {
                $group: {
                    _id: '$selectedColors',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            data: colorStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get simulation count per product
// @route   GET /api/analytics/simulation-count
// @access  Private (Admin)
exports.getSimulationCount = async (req, res) => {
    try {
        const simulationCounts = await Simulation.aggregate([
            {
                $group: {
                    _id: '$productId',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    productName: '$product.nameEn',
                    productNameAr: '$product.nameAr',
                    count: 1
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: simulationCounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get dashboard overview statistics
// @route   GET /api/analytics/overview
// @access  Private (Admin)
exports.getOverview = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ isActive: true });
        const totalSimulations = await Simulation.countDocuments();

        // Get simulations from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentSimulations = await Simulation.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                activeProducts,
                totalSimulations,
                recentSimulations
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
