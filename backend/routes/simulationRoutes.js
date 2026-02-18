const express = require('express');
const router = express.Router();
const { createSimulation, getSimulationStats } = require('../controllers/simulationController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createSimulation);

// Protected routes (Admin only)
router.get('/stats', getSimulationStats);

module.exports = router;
