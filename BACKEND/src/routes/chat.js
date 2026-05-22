const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// GET messages for a specific room (e.g., 'global')
router.get('/:room', async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room })
            .sort({ createdAt: -1 })
            .limit(50) // Get last 50 messages
            .populate('sender', 'firstName lastName avatar');
            
        // Return in chronological order
        res.status(200).json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
});

// POST create a new message (also handled by socket.io, but good for REST)
router.post('/', async (req, res) => {
    try {
        const { room, sender, content } = req.body;
        const newMessage = new Message({
            room, sender, content
        });
        await newMessage.save();
        
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'firstName lastName avatar');
            
        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error saving message', error: error.message });
    }
});

module.exports = router;
