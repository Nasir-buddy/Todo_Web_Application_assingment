const express = require('express');
const connectDB = require('./db/connection');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Base route
app.get('/', (req, res) => {
    res.send("Todo API Server is running!");
});

// Start the server
app.listen(PORT, (error) => {
    if (error) {
        console.error("Error starting server:", error);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});