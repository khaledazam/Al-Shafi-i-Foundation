const Discount = require('../models/Discount');
const Product = require('../models/Product');

// @desc    Get all discounts
// @route   GET /api/discounts
// @access  Public
exports.getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find()
            .populate('productId', 'name price image category');

        res.status(200).json({
            success: true,
            count: discounts.length,
            data: discounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create discount
// @route   POST /api/discounts
// @access  Private (Admin)
exports.createDiscount = async (req, res) => {
    try {
        const { productId, discountPercent, startDate, endDate, minQuantity, isActive } = req.body;

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const discount = await Discount.create({
            productId,
            discountPercent,
            startDate,
            endDate,
            minQuantity,
            isActive
        });

        res.status(201).json({
            success: true,
            data: discount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update discount
// @route   PUT /api/discounts/:id
// @access  Private (Admin)
exports.updateDiscount = async (req, res) => {
    try {
        let discount = await Discount.findById(req.params.id);

        if (!discount) {
            return res.status(404).json({
                success: false,
                message: 'Discount not found'
            });
        }

        discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: discount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete discount
// @route   DELETE /api/discounts/:id
// @access  Private (Admin)
exports.deleteDiscount = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);

        if (!discount) {
            return res.status(404).json({
                success: false,
                message: 'Discount not found'
            });
        }

        await discount.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Discount deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
