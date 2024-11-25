const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.email === 'nigroan67@gmail.com') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users route
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        console.log('Users found:', users); // Debug log
        res.json(users);
    } catch (error) {
        console.error('Error in /users route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 