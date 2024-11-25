const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Settings = require('../models/Settings');

// Get user settings
router.get('/', auth, async (req, res) => {
    try {
        let settings = await Settings.findOne({ userId: req.user.userId });
        
        if (!settings) {
            // Create default settings if none exist
            settings = new Settings({
                userId: req.user.userId,
                notifications: {
                    email: true,
                    weather: true,
                    vatsim: true
                },
                display: {
                    theme: 'light',
                    units: 'imperial'
                }
            });
            await settings.save();
        }

        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update password
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update notification settings
router.put('/notifications', auth, async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            { userId: req.user.userId },
            { 'notifications': req.body },
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        console.error('Error updating notifications:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update display settings
router.put('/display', auth, async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            { userId: req.user.userId },
            { 'display': req.body },
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        console.error('Error updating display settings:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete account
router.delete('/account', auth, async (req, res) => {
    try {
        // Delete user's settings
        await Settings.findOneAndDelete({ userId: req.user.userId });
        
        // Delete user
        await User.findByIdAndDelete(req.user.userId);
        
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 