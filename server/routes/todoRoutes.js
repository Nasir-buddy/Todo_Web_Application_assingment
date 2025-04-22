const express = require('express');
const router = express.Router();
const Todo = require('../db/models/todo');
const { authenticate, isAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Apply authentication middleware to all todo routes
router.use(authenticate);

// Get todos
// - Admins can get all todos with a query parameter
router.get('/', async (req, res) => {
    try {
        let todos;
        // If admin and showAll query param is true, show all todos
        if (req.user.role === 'admin' && req.query.showAll === 'true') {
            todos = await Todo.find().populate('user', 'username email');
        } else {
            // Regular users or admins viewing their own todos
            todos = await Todo.find({ user: req.user._id });
        }
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create todo
router.post('/', [
    body('title').notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').optional().isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('category').optional().isIn(['Urgent', 'Non-Urgent'])
        .withMessage('Category must be either Urgent or Non-Urgent'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be pending, in-progress, or completed')
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, dueDate, category, status } = req.body;

        // Create new todo
        const todo = await Todo.create({
            title,
            description,
            dueDate,
            category,
            status: status || 'pending',
            user: req.user._id
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update todo
router.put('/:id', [
    body('title').optional().isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
    body('description').optional().isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('category').optional().isIn(['Urgent', 'Non-Urgent'])
        .withMessage('Category must be either Urgent or Non-Urgent'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be pending, in-progress, or completed')
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check if user owns this todo or is admin
        if (todo.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this todo' });
        }

        // Update todo
        const { title, description, dueDate, category, completed, status } = req.body;
        
        console.log('Updating todo with data:', req.body);
        
        if (title) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (dueDate) todo.dueDate = dueDate;
        if (category) todo.category = category;
        if (completed !== undefined) todo.completed = completed;
        if (status) todo.status = status;

        await todo.save();
        
        console.log('Updated todo:', todo);
        res.json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check if user owns this todo or is admin
        if (todo.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this todo' });
        }

        await todo.deleteOne();
        
        res.json({ message: 'Todo removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single todo
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check if user owns this todo or is admin
        if (todo.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this todo' });
        }
        
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 