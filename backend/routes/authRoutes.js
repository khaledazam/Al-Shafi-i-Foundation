const express = require('express');
const { register, login, getMe, promoteToAdmin } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', (req, res) => res.json({ success: true, message: 'Logged out' }));
router.put('/promote/:id', protect, authorize('admin'), promoteToAdmin);

module.exports = router;
