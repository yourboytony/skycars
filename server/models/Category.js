const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add some basic validation
categorySchema.pre('save', function(next) {
    if (!this.name || this.name.length < 2) {
        next(new Error('Category name must be at least 2 characters long'));
    }
    if (!this.description || this.description.length < 5) {
        next(new Error('Category description must be at least 5 characters long'));
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category; 