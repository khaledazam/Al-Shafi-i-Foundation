const express = require('express');
const router = express.Router();
const {
    getPopularColors,
    getSimulationCount,
    getOverview
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All analytics routes are protected (Admin only)
router.get('/popular-colors', protect, getPopularColors);
router.get('/simulation-count', protect, getSimulationCount);
router.get('/overview', protect, getOverview);

module.exports = router;
