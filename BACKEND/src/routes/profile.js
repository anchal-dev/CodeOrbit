const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Submission = require('../models/submission');

// GET user profile by ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password')
            .populate('problemSolved', 'title difficulty tags')
            .populate('contestsParticipated', 'title startTime endTime');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Fetch recent submissions
        const recentSubmissions = await Submission.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('problemId', 'title difficulty');
            
        res.status(200).json({ user, recentSubmissions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});

// UPDATE user profile
router.put('/:userId', async (req, res) => {
    try {
        const { bio, github, linkedin, avatar } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { bio, github, linkedin, avatar },
            { returnDocument: 'after', runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

module.exports = router;
