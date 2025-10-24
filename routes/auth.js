const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');
const { sendOTP } = require('../utils/sms');
const { authenticate } = require('../middleware/auth');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('mobile').optional().isMobilePhone().withMessage('Valid mobile number is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, mobile } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create new user
      const user = new User({
        name,
        email,
        mobile,
        passwordHash: password // Will be hashed by pre-save hook
      });

      // Generate email verification token
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Send verification email
      try {
        await sendVerificationEmail(email, name, verificationToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue registration even if email fails
      }

      // Generate JWT
      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          emailVerified: user.emailVerified,
          mobileVerified: user.mobileVerified
        },
        message: 'Registration successful. Please check your email to verify your account.'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT
      const token = generateToken(user._id);

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          emailVerified: user.emailVerified,
          mobileVerified: user.mobileVerified
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// Resend email verification
router.post('/resend-email-verification', authenticate, async (req, res) => {
  try {
    if (req.user.emailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const verificationToken = req.user.generateEmailVerificationToken();
    await req.user.save();

    await sendVerificationEmail(req.user.email, req.user.name, verificationToken);

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

// Send mobile OTP
router.post('/send-mobile-otp', authenticate, async (req, res) => {
  try {
    if (!req.user.mobile) {
      return res.status(400).json({ error: 'Mobile number not set' });
    }

    if (req.user.mobileVerified) {
      return res.status(400).json({ error: 'Mobile already verified' });
    }

    const otp = req.user.generateMobileOTP();
    await req.user.save();

    await sendOTP(req.user.mobile, otp);

    res.json({ message: 'OTP sent to your mobile number' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify mobile OTP
router.post('/verify-mobile-otp',
  authenticate,
  [body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { otp } = req.body;
      const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

      if (!req.user.mobileOTP || !req.user.mobileOTPExpires) {
        return res.status(400).json({ error: 'No OTP request found. Please request a new OTP.' });
      }

      if (req.user.mobileOTPExpires < Date.now()) {
        return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
      }

      if (req.user.mobileOTP !== hashedOTP) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      req.user.mobileVerified = true;
      req.user.mobileOTP = undefined;
      req.user.mobileOTPExpires = undefined;
      await req.user.save();

      res.json({ message: 'Mobile number verified successfully' });
    } catch (error) {
      console.error('Mobile verification error:', error);
      res.status(500).json({ error: 'Mobile verification failed' });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile,
      role: req.user.role,
      emailVerified: req.user.emailVerified,
      mobileVerified: req.user.mobileVerified,
      shippingAddresses: req.user.shippingAddresses
    }
  });
});

module.exports = router;
