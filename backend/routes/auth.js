const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Create Account Route
router.post('/create-account', authController.createAccount);

// Login Route
router.post('/login', authController.login);

module.exports = router;
