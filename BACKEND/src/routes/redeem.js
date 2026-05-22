const express = require('express');
const router = express.Router();
const User = require('../models/user');

const STORE_ITEMS = [
    { id: '1', title: 'Premium Theme - Neon', cost: 500, icon: 'Palette', description: 'Unlock the exclusive Neon Code Editor theme.' },
    { id: '2', title: 'Profile Badge - Contender', cost: 1000, icon: 'Shield', description: 'Show off your dedication with a special badge on your profile.' },
    { id: '3', title: '1-on-1 Mentorship (30 mins)', cost: 5000, icon: 'Users', description: 'Get a 30-minute resume or code review session with an expert.' },
    { id: '4', title: 'CodeOrbit T-Shirt', cost: 10000, icon: 'Shirt', description: 'Physical CodeOrbit branded T-shirt shipped to you.' },
];

// GET available store items
router.get('/items', (req, res) => {
    res.status(200).json(STORE_ITEMS);
});

// POST redeem an item
router.post('/purchase', async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        
        const item = STORE_ITEMS.find(i => i.id === itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.points < item.cost) {
            return res.status(400).json({ message: 'Insufficient points' });
        }
        
        // Deduct points and add to history
        user.points -= item.cost;
        user.redeemHistory.push({
            item: item.title,
            cost: item.cost
        });
        
        await user.save();
        
        res.status(200).json({ 
            message: 'Item redeemed successfully', 
            points: user.points,
            redeemHistory: user.redeemHistory 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error redeeming item', error: error.message });
    }
});

module.exports = router;
