const jwt = require('jsonwebtoken');
const User = require('../db/models/User');

// JWT secret from environment variable or default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate user using JWT
exports.authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Add user info to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admin role required' });
    }
};

// Generate JWT token
exports.generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}; 