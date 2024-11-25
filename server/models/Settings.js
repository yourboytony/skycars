const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    notifications: {
        email: {
            type: Boolean,
            default: true
        },
        weather: {
            type: Boolean,
            default: true
        },
        vatsim: {
            type: Boolean,
            default: true
        }
    },
    display: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'light'
        },
        units: {
            type: String,
            enum: ['imperial', 'metric'],
            default: 'imperial'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema); 