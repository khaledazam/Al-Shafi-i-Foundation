const express = require('express');
const router = express.Router();
const {
    getDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount
} = require('../controllers/discountController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getDiscounts);

// Protected routes (Admin only)
router.post('/', protect, createDiscount);
router.put('/:id', protect, updateDiscount);
router.delete('/:id', protect, deleteDiscount);

module.exports = router;
