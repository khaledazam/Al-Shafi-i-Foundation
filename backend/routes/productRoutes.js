const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProduct,
    getStats
} = require('../controllers/productController');

// Public routes
router.get('/products', getProducts);
router.get('/products/:id', getProduct);

// Protected/Admin routes
router.post('/products', protect, authorize('admin'), upload.single('image'), createProduct);
router.put('/products/:id', protect, authorize('admin'), upload.single('image'), updateProduct);
router.delete('/products/:id', protect, authorize('admin'), deleteProduct);
router.get('/admin/stats', protect, authorize('admin'), getStats);

module.exports = router;