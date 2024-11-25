const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const forumRoutes = require('./routes/forum');
const settingsRoutes = require('./routes/settings');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://skycars-admin:nM6TyoNDIMHX9Wrk@skycars.1ceyw.mongodb.net/?retryWrites=true&w=majority&appName=SkyCars')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Test route to verify server is running
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
    console.log('404 for:', req.method, req.url);
    res.status(404).json({ error: 'Route not found' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 