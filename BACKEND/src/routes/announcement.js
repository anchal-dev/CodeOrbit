const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');

// GET active announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true })
            .sort({ createdAt: -1 })
            .populate('author', 'firstName lastName');
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements', error: error.message });
    }
});

// POST Create new announcement (Admin Only)
router.post('/', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const newAnnouncement = new Announcement({
            title, content, author
        });
        await newAnnouncement.save();
        res.status(201).json({ message: 'Announcement created', announcement: newAnnouncement });
    } catch (error) {
        res.status(500).json({ message: 'Error creating announcement', error: error.message });
    }
});

// DELETE announcement
router.delete('/:id', async (req, res) => {
    try {
        await Announcement.findByIdAndUpdate(req.params.id, { isActive: false });
        res.status(200).json({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting announcement', error: error.message });
    }
});

module.exports = router;
