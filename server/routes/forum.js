const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Topic = require('../models/Topic');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find()
            .populate({
                path: 'topics',
                populate: { 
                    path: 'author',
                    select: 'name'
                },
                options: { 
                    sort: { 'createdAt': -1 },
                    limit: 5 
                }
            })
            .sort('order')
            .exec();
        
        console.log('Categories fetched:', categories); // Debug log
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error); // Debug log
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

// Create new category (admin only)
router.post('/categories', auth, async (req, res) => {
    console.log('=== Category Creation Request ===')
    console.log('Headers:', req.headers)
    console.log('User:', req.user)
    console.log('Body:', req.body)

    if (!req.user.isAdmin) {
        console.log('Authorization failed: User is not admin')
        return res.status(403).json({ error: 'Not authorized - Admin only' })
    }

    try {
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            order: req.body.order || 0
        })

        console.log('Attempting to save category:', category)
        const savedCategory = await category.save()
        console.log('Category saved successfully:', savedCategory)
        
        res.status(201).json(savedCategory)
    } catch (error) {
        console.error('Error creating category:', error)
        res.status(500).json({ 
            error: 'Error creating category',
            details: error.message 
        })
    }
});

// Get topics in a category
router.get('/categories/:id/topics', async (req, res) => {
    try {
        const topics = await Topic.find({ category: req.params.id })
            .populate('author', 'name')
            .sort({ isSticky: -1, lastPost: -1 })
            .exec();
        res.json(topics);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching topics' });
    }
});

// Delete category (admin only)
router.delete('/categories/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Not authorized' });
    }

    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
    }
});

module.exports = router; 