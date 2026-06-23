const express = require('express');
const router  = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const {
  getChallenges,
  getDailyChallenge,
  submitScore,
  getLeaderboard,
  getAchievements,
  getUserStats
} = require('../controllers/gameController');

// Public (leaderboard readable without login)
router.get('/leaderboard',  getLeaderboard);

// Auth required
router.get('/challenges',   userMiddleware, getChallenges);
router.get('/daily',        userMiddleware, getDailyChallenge);
router.post('/submit',      userMiddleware, submitScore);
router.get('/achievements', userMiddleware, getAchievements);
router.get('/stats',        userMiddleware, getUserStats);

module.exports = router;
