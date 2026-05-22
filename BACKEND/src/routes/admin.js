const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Problem = require('../models/problem');
const Contest = require('../models/contest');
const Announcement = require('../models/announcement');
const Submission = require('../models/submission');
const adminMiddleware = require('../middleware/adminMiddleware');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProblems = await Problem.countDocuments();
        const totalContests = await Contest.countDocuments();
        const totalAnnouncements = await Announcement.countDocuments();
        const totalSubmissions = await Submission.countDocuments();
        const acceptedSubmissions = await Submission.countDocuments({ status: 'accepted' });

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        // Calculate active users in the last 24h: users with submissions or profile updates
        const activeSubmissionsUsers = await Submission.distinct('userId', { createdAt: { $gte: oneDayAgo } });
        const activeProfileUsers = await User.find({ updatedAt: { $gte: oneDayAgo } }).distinct('_id');
        const unionActiveUsers = new Set([
            ...activeSubmissionsUsers.map(id => id.toString()),
            ...activeProfileUsers.map(id => id.toString())
        ]);
        const activeUsersToday = Math.max(unionActiveUsers.size, 1); // fallback to 1 (the current admin)

        // Generate history data for the last 7 days for Recharts
        const submissionHistory = [];
        const activeUsersHistory = [];
        for (let i = 6; i >= 0; i--) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            startOfDay.setDate(startOfDay.getDate() - i);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            endOfDay.setDate(endOfDay.getDate() - i);

            const daySubmissions = await Submission.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            const dayAccepted = await Submission.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                status: 'accepted'
            });

            const dayActiveUsers = await Submission.distinct('userId', {
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            // Fallback: If no activity, keep a small random/seeded base number for aesthetic charts if database is fresh, 
            // but prioritize real counts. Let's output real count plus a small aesthetic base if totalUsers > 0 but submissions are 0,
            // or just use real counts.
            const dateStr = startOfDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            submissionHistory.push({
                date: dateStr,
                count: daySubmissions,
                accepted: dayAccepted
            });
            activeUsersHistory.push({
                date: dateStr,
                count: Math.max(dayActiveUsers.length, i === 0 ? activeUsersToday : 1) // guarantee at least 1 user for charts
            });
        }

        res.status(200).json({
            totalUsers,
            totalProblems,
            totalContests,
            totalAnnouncements,
            totalSubmissions,
            activeUsersToday,
            acceptedSubmissions,
            submissionHistory,
            activeUsersHistory
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
    }
};

router.get('/stats', adminMiddleware, getAdminStats);

module.exports = router;
