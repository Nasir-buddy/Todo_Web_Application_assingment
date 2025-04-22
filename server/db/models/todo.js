const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
        trim: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        trim: true
    },
    dueDate: {
        type: Date
    },
    category: {
        type: String,
        enum: ['Urgent', 'Non-Urgent'],
        default: 'Non-Urgent'
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create index on user field for faster queries
TodoSchema.index({ user: 1 });

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
