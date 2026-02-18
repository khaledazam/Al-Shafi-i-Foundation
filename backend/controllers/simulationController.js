const Simulation = require('../models/Simulation');
const Product = require('../models/Product');

// @desc    Create simulation
// @route   POST /api/simulations
// @access  Public
exports.createSimulation = async (req, res) => {
    try {
        const { productId, selectedColors, customerEmail, roomType } = req.body;

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const simulation = await Simulation.create({
            productId,
            selectedColors,
            customerEmail,
            roomType
        });

        res.status(201).json({
            success: true,
            data: simulation,
            message: 'Simulation saved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get simulation statistics
// @route   GET /api/simulations/stats
// @access  Private (Admin)
exports.getSimulationStats = async (req, res) => {
    try {
        // Total simulations
        const totalSimulations = await Simulation.countDocuments();

        // Simulations by product
        const simulationsByProduct = await Simulation.aggregate([
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
            {
                $unwind: '$product'
            },
            {
                $project: {
                    productName: '$product.nameEn',
                    productNameAr: '$product.nameAr',
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalSimulations,
                simulationsByProduct
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
