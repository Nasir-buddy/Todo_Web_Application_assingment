const express = require('express');
const router = express.Router();
const User = require('../db/models/User');
const { body, validationResult } = require('express-validator');
const { generateToken } = require('../middleware/auth');

// Register a new user
router.post('/register', [
    // Validate input
    body('email').isEmail().withMessage('Enter a valid email'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, username, password, role } = req.body;

        // Check if email or username already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Create new user (password will be hashed by the pre-save hook)
        const user = await User.create({
            email,
            username,
            password,
            role: role === 'admin' ? 'admin' : 'user' // Only allow admin if specified
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        // Check if login is email or username
        const user = await User.findOne({
            $or: [{ email: login }, { username: login }]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 