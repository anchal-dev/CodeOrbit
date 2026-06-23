const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true, index: true }, // 'YYYY-MM-DD'
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'GameQuestion', required: true },
  rewardPoints: { type: Number, default: 50 },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
