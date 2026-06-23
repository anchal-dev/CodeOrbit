const GameQuestion  = require('../models/GameQuestion');
const GameScore     = require('../models/GameScore');
const Achievement   = require('../models/Achievement');
const DailyChallenge = require('../models/DailyChallenge');
const User          = require('../models/user');

// ─── helpers ───────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

const XP_LEVELS = [
  { name: 'Bronze',   min: 0    },
  { name: 'Silver',   min: 500  },
  { name: 'Gold',     min: 1500 },
  { name: 'Platinum', min: 3500 },
  { name: 'Diamond',  min: 7500 },
];

function computeLevel(xp) {
  let level = XP_LEVELS[0];
  for (const l of XP_LEVELS) {
    if (xp >= l.min) level = l;
  }
  const idx   = XP_LEVELS.indexOf(level);
  const next  = XP_LEVELS[idx + 1];
  const progress = next
    ? Math.round(((xp - level.min) / (next.min - level.min)) * 100)
    : 100;
  return { ...level, progress, nextLevel: next?.name || 'Max', nextMin: next?.min || level.min };
}

const ACHIEVEMENT_DEFS = {
  first_win:    { name: 'First Win',   description: 'Complete your first game', icon: '🏆' },
  streak_7:     { name: '7 Day Streak',description: 'Play 7 days in a row',     icon: '🔥' },
  quiz_master:  { name: 'Quiz Master', description: 'Score 100% on a quiz',     icon: '🧠' },
  bug_hunter:   { name: 'Bug Hunter',  description: 'Solve 10 bug challenges',  icon: '🐛' },
  speed_demon:  { name: 'Speed Demon', description: 'Finish speed round < 60s', icon: '⚡' },
  dp_expert:    { name: 'DP Expert',   description: 'Answer 5 DP questions correct', icon: '📈' },
};

async function unlockAchievement(userId, achievementId) {
  const def = ACHIEVEMENT_DEFS[achievementId];
  if (!def) return;
  try {
    await Achievement.findOneAndUpdate(
      { userId, achievementId },
      { userId, achievementId, ...def },
      { upsert: true, new: true }
    );
  } catch (_) { /* ignore duplicate */ }
}

// ─── GET /game/challenges?type=quiz&limit=10 ───────────────────────────────
exports.getChallenges = async (req, res) => {
  try {
    const { type = 'quiz', limit = 10, difficulty } = req.query;
    const filter = { type, isActive: true };
    if (difficulty) filter.difficulty = difficulty;

    const questions = await GameQuestion.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit) } }
    ]);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /game/daily ────────────────────────────────────────────────────────
exports.getDailyChallenge = async (req, res) => {
  try {
    const date = today();
    let challenge = await DailyChallenge.findOne({ date }).populate('question');

    if (!challenge) {
      // Pick random quiz question for today
      const [q] = await GameQuestion.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: 1 } }
      ]);
      if (!q) return res.status(404).json({ error: 'No questions available' });

      challenge = await DailyChallenge.create({ date, question: q._id, rewardPoints: 50 });
      challenge = await challenge.populate('question');
    }

    const userId = req.user?._id;
    const completed = userId && challenge.completedBy.some(id => id.equals(userId));

    res.json({ challenge, completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /game/submit ──────────────────────────────────────────────────────
exports.submitScore = async (req, res) => {
  try {
    const userId = req.user._id;
    const { gameType, score, correctAnswers, totalQuestions, timeTaken, isDaily } = req.body;

    const xpEarned = score;

    const attempt = await GameScore.create({
      userId, gameType, score, xpEarned,
      totalQuestions, correctAnswers, timeTaken
    });

    // Add XP to user's orbit coins / points
    await User.findByIdAndUpdate(userId, {
      $inc: { orbitCoins: xpEarned, points: xpEarned }
    });

    // Daily challenge completion
    if (isDaily) {
      const date = today();
      const challenge = await DailyChallenge.findOne({ date });
      if (challenge && !challenge.completedBy.includes(userId)) {
        challenge.completedBy.push(userId);
        await challenge.save();
        await User.findByIdAndUpdate(userId, {
          $inc: { orbitCoins: challenge.rewardPoints, points: challenge.rewardPoints }
        });
      }
    }

    // Achievement checks
    const totalAttempts = await GameScore.countDocuments({ userId });
    if (totalAttempts === 1) await unlockAchievement(userId, 'first_win');

    if (gameType === 'quiz' && correctAnswers === totalQuestions && totalQuestions >= 10)
      await unlockAchievement(userId, 'quiz_master');

    if (gameType === 'speed' && timeTaken < 60)
      await unlockAchievement(userId, 'speed_demon');

    if (gameType === 'bug') {
      const bugCount = await GameScore.countDocuments({ userId, gameType: 'bug' });
      if (bugCount >= 10) await unlockAchievement(userId, 'bug_hunter');
    }

    const updatedUser = await User.findById(userId).select('orbitCoins points');
    const levelInfo   = computeLevel(updatedUser.orbitCoins || 0);

    res.json({ success: true, xpEarned, attempt, levelInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /game/leaderboard?period=global|weekly ─────────────────────────────
exports.getLeaderboard = async (req, res) => {
  try {
    const { period = 'global' } = req.query;
    const match = {};
    if (period === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      match.createdAt = { $gte: weekAgo };
    }

    const rows = await GameScore.aggregate([
      { $match: match },
      { $group: { _id: '$userId', totalScore: { $sum: '$score' }, games: { $sum: 1 } } },
      { $sort: { totalScore: -1 } },
      { $limit: 20 },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: {
          _id: 1,
          totalScore: 1,
          games: 1,
          'user.firstName': 1,
          'user.lastName': 1,
          'user.avatar': 1,
          'user.orbitCoins': 1
        }
      }
    ]);

    const ranked = rows.map((r, i) => ({
      rank: i + 1,
      userId: r._id,
      name: `${r.user.firstName} ${r.user.lastName || ''}`.trim(),
      avatar: r.user.avatar || '',
      score: r.totalScore,
      games: r.games,
      xp: r.user.orbitCoins || 0
    }));

    res.json({ leaderboard: ranked, period });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /game/achievements ─────────────────────────────────────────────────
exports.getAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const earned = await Achievement.find({ userId });
    const earnedIds = new Set(earned.map(a => a.achievementId));

    const all = Object.entries(ACHIEVEMENT_DEFS).map(([id, def]) => ({
      achievementId: id,
      ...def,
      earned: earnedIds.has(id),
      earnedAt: earned.find(a => a.achievementId === id)?.earnedAt || null
    }));

    res.json({ achievements: all });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /game/stats ────────────────────────────────────────────────────────
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user   = await User.findById(userId).select('orbitCoins points firstName lastName avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const totalGames   = await GameScore.countDocuments({ userId });
    const totalScore   = await GameScore.aggregate([
      { $match: { userId } }, { $group: { _id: null, sum: { $sum: '$score' } } }
    ]);

    // Global rank
    const higherScorers = await GameScore.aggregate([
      { $group: { _id: '$userId', s: { $sum: '$score' } } },
      { $match: { s: { $gt: totalScore[0]?.sum || 0 } } },
      { $count: 'count' }
    ]);
    const rank = (higherScorers[0]?.count || 0) + 1;

    const levelInfo = computeLevel(user.orbitCoins || 0);

    res.json({
      user: {
        name: `${user.firstName} ${user.lastName || ''}`.trim(),
        avatar: user.avatar,
        xp: user.orbitCoins || 0,
        points: user.points || 0
      },
      totalGames,
      totalScore: totalScore[0]?.sum || 0,
      globalRank: rank,
      levelInfo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
