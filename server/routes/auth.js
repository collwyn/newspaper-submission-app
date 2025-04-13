const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect, validateRequest } = require('../middleware/auth');

// Routes
router.post('/register', validateRequest, register);
router.post('/login', validateRequest, login);
router.get('/me', protect, getMe);

module.exports = router;
