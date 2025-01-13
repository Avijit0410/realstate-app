const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Login route
router.post('/login', login);

// Get current user route
router.get('/me', auth, getMe);

module.exports = router; 