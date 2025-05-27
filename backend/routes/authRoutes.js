// routes/authRoutes.js

const express = require('express');
const { signup, login, requestOTP } = require('../controllers/authController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Request OTP route
router.post('/request-otp', requestOTP);

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Doctor-specific route (protected)
router.get('/doctor/dashboard', authenticate, authorizeRole('doctor'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the doctor dashboard' });
});

// Patient-specific route (protected)
router.get('/patient/dashboard', authenticate, authorizeRole('patient'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the patient dashboard' });
});

module.exports = router;
