const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  achievementId: { type: String, required: true }, // e.g. 'first_win', '7_day_streak'
  name: String,
  description: String,
  icon: String,
  earnedAt: { type: Date, default: Date.now }
});

achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
