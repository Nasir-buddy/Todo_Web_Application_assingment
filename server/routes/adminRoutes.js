const express = require('express');
const router = express.Router();
const User = require('../db/models/User');
const Todo = require('../db/models/todo');
const { authenticate, isAdmin } = require('../middleware/auth');

// Apply authentication and admin middleware to all admin routes
router.use(authenticate);
router.use(isAdmin);

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all todos
router.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find().populate('user', 'username email');
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from changing their own role
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot change your own role' });
        }

        user.role = role;
        await user.save();
        
        res.json({ 
            _id: user._id, 
            username: user.username, 
            email: user.email, 
            role: user.role 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 