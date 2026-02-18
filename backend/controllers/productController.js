const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('✅ Cloudinary Configured:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? '✓ Set' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ Set' : 'MISSING'
});

// @desc    Create product with image
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        console.log('📦 Creating product...');
        console.log('BODY:', req.body);
        console.log('FILE:', req.file ? { fieldname: req.file.fieldname, originalname: req.file.originalname, size: req.file.size } : 'No file');

        // Parse JSON strings from FormData
        if (typeof req.body.name === 'string') {
            req.body.name = JSON.parse(req.body.name);
        }
        if (typeof req.body.description === 'string') {
            req.body.description = JSON.parse(req.body.description);
        }
        if (typeof req.body.rgbValues === 'string') {
            req.body.rgbValues = JSON.parse(req.body.rgbValues);
        }

        // Validate required fields
        if (!req.body.name?.en || !req.body.hexCode || !req.body.category) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name (en), hexCode, category'
            });
        }

        // Build product data
        const productData = {
            name: req.body.name,
            description: req.body.description || { en: '', ar: '' },
            category: req.body.category,
            hexCode: req.body.hexCode,
            rgbValues: req.body.rgbValues || { r: 0, g: 0, b: 0 },
            price: parseFloat(req.body.price) || 0,
            stock: parseInt(req.body.stock) || 0,
            isActive: req.body.isActive === 'true' || req.body.isActive === true,
            createdBy: req.user.id,
            image: '' // Will be filled if image uploaded
        };

        // Handle image upload to Cloudinary
        if (req.file) {
            try {
                console.log('📸 Processing image upload...');
                console.log('File details:', {
                    fieldname: req.file.fieldname,
                    originalname: req.file.originalname,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    path: req.file.path,
                    filename: req.file.filename,
                    secure_url: req.file.secure_url
                });

                // Get URL from multer-storage-cloudinary
                const imageUrl = req.file.secure_url || req.file.path;

                if (imageUrl) {
                    productData.image = imageUrl;
                    console.log('✅ Image URL saved:', imageUrl);
                } else {
                    console.warn('⚠️ No image URL from multer-storage-cloudinary');
                }

                // Save metadata if available
                if (req.file.filename) {
                    productData.images = {
                        cloudinaryId: req.file.filename
                    };
                }

            } catch (imageError) {
                console.error('❌ Image processing error:', imageError);
                // Continue without image - don't fail the whole request
            }
        }

        // Create product in MongoDB
        const product = await Product.create(productData);
        console.log('✅ Product created:', product._id);

        // Populate createdBy
        await product.populate('createdBy', 'fullName email');

        res.status(201).json({
            success: true,
            data: product,
            message: 'Product created successfully'
        });

    } catch (error) {
        console.error('❌ Create product error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create product'
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        console.log('📝 Updating product...');

        // Parse JSON strings
        if (typeof req.body.name === 'string') {
            req.body.name = JSON.parse(req.body.name);
        }
        if (typeof req.body.description === 'string') {
            req.body.description = JSON.parse(req.body.description);
        }
        if (typeof req.body.rgbValues === 'string') {
            req.body.rgbValues = JSON.parse(req.body.rgbValues);
        }

        // Find product
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Update basic fields
        if (req.body.name) product.name = req.body.name;
        if (req.body.description) product.description = req.body.description;
        if (req.body.category) product.category = req.body.category;
        if (req.body.hexCode) product.hexCode = req.body.hexCode;
        if (req.body.rgbValues) product.rgbValues = req.body.rgbValues;
        if (req.body.price !== undefined) product.price = parseFloat(req.body.price);
        if (req.body.stock !== undefined) product.stock = parseInt(req.body.stock);
        if (req.body.isActive !== undefined) {
            product.isActive = req.body.isActive === 'true' || req.body.isActive === true;
        }

        // Handle image update
        if (req.file) {
            try {
                console.log('📸 Updating image...');

                // Delete old image from Cloudinary if exists
                if (product.images?.cloudinaryId) {
                    try {
                        await cloudinary.uploader.destroy(product.images.cloudinaryId);
                        console.log('🗑️ Old image deleted from Cloudinary');
                    } catch (deleteError) {
                        console.warn('⚠️ Could not delete old image:', deleteError.message);
                    }
                }

                // Get new image URL from multer-storage-cloudinary
                const imageUrl = req.file.secure_url || req.file.path;

                if (imageUrl) {
                    product.image = imageUrl;
                    console.log('✅ New image URL saved:', imageUrl);

                    if (req.file.filename) {
                        product.images = {
                            cloudinaryId: req.file.filename
                        };
                    }
                }

            } catch (imageError) {
                console.error('❌ Image update error:', imageError);
                // Continue without image update
            }
        }

        // Save updated product
        await product.save();
        await product.populate('createdBy', 'fullName email');

        console.log('✅ Product updated:', product._id);

        res.status(200).json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        });

    } catch (error) {
        console.error('❌ Update product error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update product'
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        console.log('🗑️ Deleting product:', req.params.id);

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Delete image from Cloudinary if exists
        if (product.images?.cloudinaryId) {
            try {
                await cloudinary.uploader.destroy(product.images.cloudinaryId);
                console.log('🗑️ Image deleted from Cloudinary');
            } catch (deleteError) {
                console.warn('⚠️ Could not delete image:', deleteError.message);
            }
        }

        // Delete from MongoDB
        await Product.findByIdAndDelete(req.params.id);

        console.log('✅ Product deleted');

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('❌ Delete product error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete product'
        });
    }
};

// @desc    Get all products with pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 50, category, search, sort = 'newest' } = req.query;

        // Build query
        const query = { isActive: true };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { 'name.en': { $regex: search, $options: 'i' } },
                { 'name.ar': { $regex: search, $options: 'i' } },
                { 'description.en': { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort
        let sortObj = { createdAt: -1 }; // default: newest
        if (sort === 'price_asc') sortObj = { price: 1 };
        else if (sort === 'price_desc') sortObj = { price: -1 };
        else if (sort === 'name') sortObj = { 'name.en': 1 };

        // Calculate pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 50;
        const skip = (pageNum - 1) * limitNum;

        // Get total count
        const total = await Product.countDocuments(query);

        // Fetch products
        const products = await Product.find(query)
            .populate('createdBy', 'fullName email')
            .sort(sortObj)
            .limit(limitNum)
            .skip(skip)
            .lean();

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalProducts: total,
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1,
                limit: limitNum
            }
        });

    } catch (error) {
        console.error('❌ Get products error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch products'
        });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('createdBy', 'fullName email');

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('❌ Get product error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch product'
        });
    }
};

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
    try {
        const products = await Product.find();

        const stats = {
            totalProducts: products.length,
            paintCount: products.filter(p => p.category === 'Paint').length,
            wallpaperCount: products.filter(p => p.category === 'Wallpaper').length,
            decorCount: products.filter(p => p.category === 'Decor').length,
            inStockCount: products.filter(p => p.stock > 0).length,
            outOfStockCount: products.filter(p => p.stock <= 0).length,
            totalInventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
        };

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('❌ Get stats error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch stats'
        });
    }
};

// Export all functions
module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProduct,
    getStats
};