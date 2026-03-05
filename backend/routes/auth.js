const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Generate CAPTCHA endpoint
router.get('/captcha', authController.generateCaptcha);

// Login Route
router.post('/login', (req, res, next) => {
  console.log("🔵 Auth route /login hit");
  next();
}, authController.login);

module.exports = router;
