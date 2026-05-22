const Problem      = require('../models/problem');
const ProblemOfDay = require('../models/problemOfDay');

/** Get today's date string in UTC — "YYYY-MM-DD" */
const todayUTC = () => new Date().toISOString().slice(0, 10);

/**
 * Ensure a POTD document exists for today.
 * If none exists, pick a random problem that wasn't POTD in the last 30 days.
 */
const getOrCreatePOTD = async () => {
  const today = todayUTC();

  // Fast path — already created today
  let potd = await ProblemOfDay.findOne({ date: today }).populate('problemId');
  if (potd) return potd;

  // Find IDs used in last 30 days to avoid repetition
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const recent = await ProblemOfDay.find({ createdAt: { $gte: cutoff } }).select('problemId');
  const recentIds = recent.map((r) => String(r.problemId));

  // Pick random problem not in recent list
  const all = await Problem.find({ _id: { $nin: recentIds } }).select('_id');
  const pool = all.length > 0 ? all : await Problem.find().select('_id'); // fallback — use all if pool empty
  if (!pool.length) throw new Error('No problems in database');

  const picked = pool[Math.floor(Math.random() * pool.length)];

  // Use findOneAndUpdate with upsert to avoid race conditions (two requests at midnight)
  potd = await ProblemOfDay.findOneAndUpdate(
    { date: today },
    { $setOnInsert: { date: today, problemId: picked._id, rewardedUsers: [] } },
    { upsert: true, returnDocument: 'after' }
  ).populate('problemId');

  return potd;
};

/* ─── GET /potd — return today's problem ──────────────────────────────────── */
const getPOTD = async (req, res) => {
  try {
    const potd = await getOrCreatePOTD();
    const userId = req.user?._id;

    const solvedToday = userId
      ? potd.rewardedUsers.some((id) => String(id) === String(userId))
      : false;

    return res.status(200).json({
      date:        potd.date,
      reward:      10,
      solvedToday,
      problem:     potd.problemId,
    });
  } catch (err) {
    console.error('[POTD] getPOTD error:', err);
    return res.status(500).json({ error: err.message });
  }
};

/* ─── POST /potd/reward — claim POTD reward after Accepted submission ──────── */
const claimPOTDReward = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const userId = req.user._id;
    const today  = todayUTC();

    const potd = await ProblemOfDay.findOne({ date: today });
    if (!potd) return res.status(404).json({ error: 'No POTD for today' });

    // Already rewarded?
    if (potd.rewardedUsers.some((id) => String(id) === String(userId))) {
      return res.status(200).json({ success: true, coinsAwarded: 0, alreadyClaimed: true });
    }

    // Mark rewarded + award coins atomically
    await Promise.all([
      ProblemOfDay.updateOne(
        { _id: potd._id },
        { $addToSet: { rewardedUsers: userId } }
      ),
      req.user.constructor.findByIdAndUpdate(userId, {
        $inc: { orbitCoins: 10, points: 10 },
        $push: {
          dailySolvedProblems: {
            problemId: potd.problemId,
            date:      today,
            solvedAt:  new Date()
          }
        }
      })
    ]);

    return res.status(200).json({ success: true, coinsAwarded: 10 });
  } catch (err) {
    console.error('[POTD] claimReward error:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getPOTD, claimPOTDReward, getOrCreatePOTD };
