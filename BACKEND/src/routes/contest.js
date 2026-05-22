const express = require('express');
const router = express.Router();
const Contest = require('../models/contest');
const User = require('../models/user');

// Helper to determine status based on current time
const getStatus = (start, end) => {
    const now = new Date();
    if (now < new Date(start)) return 'upcoming';
    if (now >= new Date(start) && now <= new Date(end)) return 'live';
    return 'ended';
};

// GET all contests
router.get('/', async (req, res) => {
    try {
        const contests = await Contest.find().populate('problems', 'title difficulty tags');
        
        // Dynamically update status in db if it changed
        for (let contest of contests) {
            const currentStatus = getStatus(contest.startTime, contest.endTime);
            if (contest.status !== currentStatus) {
                contest.status = currentStatus;
                await contest.save();
            }
        }
        
        res.status(200).json(contests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contests', error: error.message });
    }
});

// POST Create a new contest (Admin only)
const adminMiddleware = require('../middleware/adminMiddleware');
router.post('/', adminMiddleware, async (req, res) => {
    try {
        const { title, description, startTime, endTime, duration, problems, rewards } = req.body;
        
        if (!title || !description || !startTime || !endTime) {
            return res.status(400).json({ message: 'Title, description, startTime, and endTime are required' });
        }
        
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const newContest = new Contest({
            title,
            slug,
            description,
            startTime,
            endTime,
            duration: duration || 90,
            problems: problems || [],
            rewards: rewards || { coins: 100, badges: 'Top 3 Badge Rewards' },
            status: getStatus(startTime, endTime),
            participants: [],
            leaderboard: []
        });
        
        await newContest.save();
        res.status(201).json({ message: 'Contest created successfully', contest: newContest });
    } catch (error) {
        res.status(500).json({ message: 'Error creating contest', error: error.message });
    }
});

// GET single contest details
router.get('/:id', async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('problems', 'title difficulty tags')
            .populate('participants.userId', 'firstName lastName avatar');
            
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        
        // Dynamic status check
        const currentStatus = getStatus(contest.startTime, contest.endTime);
        if (contest.status !== currentStatus) {
            contest.status = currentStatus;
            await contest.save();
        }
        
        res.status(200).json(contest);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contest details', error: error.message });
    }
});

// POST Join a contest
const joinContestHandler = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: 'User ID is required' });
        
        const contest = await Contest.findById(req.params.id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });
        
        // Check if already joined
        const hasJoined = contest.participants.some(p => p.userId && p.userId.toString() === userId.toString());
        if (hasJoined) {
            return res.status(400).json({ message: 'Already joined this contest' });
        }
        
        contest.participants.push({ userId, score: 0, penalty: 0, problemsSolved: 0 });
        await contest.save();
        
        // Also update user
        await User.findByIdAndUpdate(userId, {
            $addToSet: { contestsParticipated: contest._id }
        });
        
        res.status(200).json({ message: 'Successfully joined the contest', contest });
    } catch (error) {
        res.status(500).json({ message: 'Error joining contest', error: error.message });
    }
};

router.post('/:id/join', joinContestHandler);
router.post('/join/:id', joinContestHandler);

// GET contest leaderboard
const getLeaderboardHandler = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('participants.userId', 'firstName lastName avatar');
            
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        
        // Combine real participants and mock leaderboard data
        const realLeaderboard = contest.participants.map((p, idx) => ({
            rank: 0, // will compute after sorting
            user: {
                firstName: p.userId?.firstName || 'User',
                lastName: p.userId?.lastName || '',
                avatar: p.userId?.avatar || '',
                username: p.userId?.firstName ? p.userId.firstName.toLowerCase() : 'user'
            },
            score: p.score || 0,
            penalty: p.penalty || 0,
            problemsSolved: p.problemsSolved || 0
        }));
        
        const mockLeaderboard = contest.leaderboard || [];
        
        // Combine them
        let fullLeaderboard = [...realLeaderboard, ...mockLeaderboard];
        
        // Sort: primary score DESC, secondary penalty ASC
        fullLeaderboard.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.penalty - b.penalty;
        });
        
        // Assign ranks
        fullLeaderboard = fullLeaderboard.map((item, idx) => ({
            ...item,
            rank: idx + 1
        }));
        
        res.status(200).json(fullLeaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
};

router.get('/:id/leaderboard', getLeaderboardHandler);
router.get('/leaderboard/:id', getLeaderboardHandler);

module.exports = router;
