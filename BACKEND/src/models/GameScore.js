const mongoose = require('mongoose');

const gameScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  gameType: {
    type: String,
    enum: ['quiz', 'complexity', 'output', 'bug', 'pattern', 'speed', 'daily'],
    required: true
  },
  score: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 }, // seconds
  streak: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, index: true }
});

// Compound index for leaderboard queries
gameScoreSchema.index({ gameType: 1, score: -1 });
gameScoreSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('GameScore', gameScoreSchema);
