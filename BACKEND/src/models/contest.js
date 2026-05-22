const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true,
        default: 90
    },
    problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }],
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: {
            type: Number,
            default: 0
        },
        penalty: {
            type: Number, // in minutes
            default: 0
        },
        problemsSolved: {
            type: Number,
            default: 0
        },
        joinTime: {
            type: Date,
            default: Date.now
        }
    }],
    leaderboard: [{
        rank: Number,
        user: {
            firstName: String,
            lastName: String,
            avatar: String,
            username: String
        },
        score: Number,
        penalty: Number,
        problemsSolved: Number
    }],
    rewards: {
        coins: { type: Number, default: 100 },
        badges: { type: String, default: 'Top 3 Badge Rewards' }
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'ended'],
        default: 'upcoming'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);
