import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Zap, Flame, Star, Target, Clock, Shield,
  ChevronRight, Lock, Crown, Medal, TrendingUp, X,
  Users, Calendar, Award
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';

// Game modals
import DSAQuiz          from '../components/games/DSAQuiz';
import BugHunter        from '../components/games/BugHunter';
import ComplexityMaster from '../components/games/ComplexityMaster';
import OutputPredictor  from '../components/games/OutputPredictor';
import PatternRecognition from '../components/games/PatternRecognition';
import SpeedChallenge   from '../components/games/SpeedChallenge';

// ─── constants ────────────────────────────────────────────────────────────────
const LEVELS = [
  { name: 'Bronze',   min: 0,    color: 'from-amber-700 to-amber-500',   text: 'text-amber-400',   icon: '🥉' },
  { name: 'Silver',   min: 500,  color: 'from-slate-400 to-slate-300',   text: 'text-slate-300',   icon: '🥈' },
  { name: 'Gold',     min: 1500, color: 'from-yellow-500 to-amber-400',  text: 'text-yellow-400',  icon: '🥇' },
  { name: 'Platinum', min: 3500, color: 'from-cyan-500 to-blue-400',     text: 'text-cyan-400',    icon: '💎' },
  { name: 'Diamond',  min: 7500, color: 'from-purple-500 to-indigo-400', text: 'text-purple-400',  icon: '💠' },
];

function getLevel(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.min) level = l; }
  const idx  = LEVELS.indexOf(level);
  const next = LEVELS[idx + 1];
  const pct  = next ? Math.round(((xp - level.min) / (next.min - level.min)) * 100) : 100;
  return { ...level, pct, nextMin: next?.min || level.min, nextName: next?.name || 'Max' };
}

const GAME_MODES = [
  {
    id: 'bug',
    emoji: '🐛',
    title: 'Bug Hunter',
    description: 'Find mistakes in real code snippets. Sharpen your debugging eye.',
    tags: ['Timer', 'Multiple levels', 'Earn points'],
    gradient: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30 hover:border-orange-500/60',
    glow: 'hover:shadow-orange-500/20',
    component: BugHunter,
    xp: 20,
  },
  {
    id: 'speed',
    emoji: '⚡',
    title: 'Speed Challenge',
    description: 'Solve coding problems under time pressure. Fast fingers, sharp mind.',
    tags: ['15s countdown', 'Time bonus', 'Streak multiplier'],
    gradient: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/30 hover:border-yellow-500/60',
    glow: 'hover:shadow-yellow-500/20',
    component: SpeedChallenge,
    xp: 15,
  },
  {
    id: 'quiz',
    emoji: '🧠',
    title: 'DSA Quiz Arena',
    description: 'MCQs on Arrays, DP, Graphs, Trees, OS, DBMS, and CN. Test your theory.',
    tags: ['10 questions', 'Score system', '30s each'],
    gradient: 'from-purple-500/20 to-indigo-500/20',
    border: 'border-purple-500/30 hover:border-purple-500/60',
    glow: 'hover:shadow-purple-500/20',
    component: DSAQuiz,
    xp: 10,
  },
  {
    id: 'complexity',
    emoji: '📈',
    title: 'Complexity Master',
    description: 'Guess the Big-O. O(N)? O(log N)? O(N²)? Prove you know your algos.',
    tags: ['Code analysis', '25s each', 'Visual feedback'],
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30 hover:border-blue-500/60',
    glow: 'hover:shadow-blue-500/20',
    component: ComplexityMaster,
    xp: 10,
  },
  {
    id: 'output',
    emoji: '🔍',
    title: 'Output Predictor',
    description: 'Predict what the program prints — without running it. Mental debugging.',
    tags: ['Code tracing', '45s each', 'Explanation'],
    gradient: 'from-teal-500/20 to-emerald-500/20',
    border: 'border-teal-500/30 hover:border-teal-500/60',
    glow: 'hover:shadow-teal-500/20',
    component: OutputPredictor,
    xp: 15,
  },
  {
    id: 'pattern',
    emoji: '🎯',
    title: 'Pattern Recognition',
    description: 'Identify the right algorithm — Sliding Window, Binary Search, DP, Graph.',
    tags: ['Problem solving', '30s each', 'Skill building'],
    gradient: 'from-pink-500/20 to-purple-500/20',
    border: 'border-pink-500/30 hover:border-pink-500/60',
    glow: 'hover:shadow-pink-500/20',
    component: PatternRecognition,
    xp: 10,
  },
];

const ACHIEVEMENTS_DEF = [
  { id: 'first_win',   icon: '🏆', name: 'First Win',    desc: 'Complete your first game' },
  { id: 'streak_7',    icon: '🔥', name: '7 Day Streak', desc: 'Play 7 days in a row' },
  { id: 'quiz_master', icon: '🧠', name: 'Quiz Master',  desc: 'Score 100% on a quiz' },
  { id: 'bug_hunter',  icon: '🐛', name: 'Bug Hunter',   desc: 'Solve 10 bug challenges' },
  { id: 'speed_demon', icon: '⚡', name: 'Speed Demon',  desc: 'Finish a speed round < 60s' },
  { id: 'dp_expert',   icon: '📈', name: 'DP Expert',    desc: 'Get 5 DP questions right' },
];

// ─── Modal wrapper ────────────────────────────────────────────────────────────
const GameModal = ({ mode, onClose, onComplete }) => {
  const Component = mode.component;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 30 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        className="w-full max-w-lg h-[80vh] max-h-[700px] bg-[#0f1929] border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <Component onClose={onClose} onComplete={onComplete} />
      </motion.div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const GameZone = () => {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const navigate = useNavigate();

  const [activeMode, setActiveMode]   = useState(null);
  const [stats, setStats]             = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbPeriod, setLbPeriod]       = useState('global');
  const [achievements, setAchievements] = useState([]);
  const [daily, setDaily]             = useState(null);
  const [dailyDone, setDailyDone]     = useState(false);
  const [toast, setToast]             = useState(null);
  const [lbTab, setLbTab]             = useState('global');

  // Redirect guests
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  // Load data
  useEffect(() => {
    if (!isAuthenticated) return;
    axiosClient.get('/api/game/stats').then(r => setStats(r.data)).catch(() => {});
    axiosClient.get('/api/game/achievements').then(r => setAchievements(r.data.achievements || [])).catch(() => {});
    axiosClient.get('/api/game/daily').then(r => { setDaily(r.data.challenge); setDailyDone(r.data.completed); }).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    axiosClient.get(`/api/game/leaderboard?period=${lbTab}`)
      .then(r => setLeaderboard(r.data.leaderboard || []))
      .catch(() => {});
  }, [lbTab]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleGameComplete = ({ score, correct, total }) => {
    showToast(`+${score} XP earned! ${correct}/${total} correct 🎉`);
    // Refresh stats
    axiosClient.get('/api/game/stats').then(r => setStats(r.data)).catch(() => {});
    axiosClient.get('/api/game/achievements').then(r => setAchievements(r.data.achievements || [])).catch(() => {});
  };

  const levelInfo = stats ? getLevel(stats.user?.xp || 0) : getLevel(0);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#080d18] text-white">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[130px]" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl bg-[#1e293b] border border-green-500/40 shadow-xl text-green-300 font-semibold text-sm flex items-center gap-2"
          >
            <Zap size={16} className="text-yellow-400" />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Game Modal */}
      <AnimatePresence>
        {activeMode && (
          <GameModal
            mode={activeMode}
            onClose={() => setActiveMode(null)}
            onComplete={(result) => { setActiveMode(null); handleGameComplete(result); }}
          />
        )}
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Level badge */}
          <div className="flex items-center justify-center mb-6">
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border bg-gradient-to-r ${levelInfo.color} bg-clip-text text-transparent border-purple-500/30 bg-slate-800/40 backdrop-blur-sm flex items-center gap-2`}>
              <span>{levelInfo.icon}</span>
              <span className={levelInfo.text}>{levelInfo.name} Rank</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-slate-400">
              Level Up Your
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
              Coding Skills
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Learn DSA through challenges, quizzes, debugging battles, and coding games.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-4 py-2.5">
              <Zap className="text-yellow-400" size={18} />
              <span className="text-slate-300 text-sm font-semibold">{stats?.user?.xp ?? 0} XP</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-4 py-2.5">
              <Trophy className="text-indigo-400" size={18} />
              <span className="text-slate-300 text-sm font-semibold">Rank #{stats?.globalRank ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-4 py-2.5">
              <Flame className="text-orange-400" size={18} />
              <span className="text-slate-300 text-sm font-semibold">{stats?.totalGames ?? 0} Games Played</span>
            </div>
          </div>

          {/* XP progress bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-mono">
              <span>{levelInfo.name}</span>
              <span>{stats?.user?.xp ?? 0} / {levelInfo.nextMin} XP → {levelInfo.nextName}</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(levelInfo.pct, 100)}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${levelInfo.color}`}
              />
            </div>
          </div>
        </motion.div>

        {/* ── GAME MODES ── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Game Modes</h2>
              <p className="text-slate-400 text-sm">Pick your challenge</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAME_MODES.map((mode, i) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`group relative bg-gradient-to-br ${mode.gradient} backdrop-blur-sm border ${mode.border} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${mode.glow} overflow-hidden`}
                onClick={() => setActiveMode(mode)}
              >
                {/* Glow overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{mode.emoji}</span>
                    <div className="flex items-center gap-1 text-xs bg-slate-800/60 border border-slate-700/50 rounded-full px-2.5 py-1 font-semibold text-yellow-400">
                      <Zap size={10} />
                      +{mode.xp} XP
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{mode.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{mode.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {mode.tags.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 rounded-xl text-sm font-semibold text-white transition-all group-hover:border-white/20">
                    Play Now <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── DAILY CHALLENGE + ACHIEVEMENTS side by side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">

          {/* Daily Challenge */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Daily Challenge</h2>
                <p className="text-slate-400 text-sm">Resets every midnight • +50 XP</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6">
              {daily?.question ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">🌟</span>
                    {dailyDone && (
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-xs font-bold">
                        ✅ Completed
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-base mb-2 line-clamp-2">
                    {daily.question.question}
                  </h3>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs px-2 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-slate-400 capitalize">
                      {daily.question.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-slate-400">
                      {daily.question.topic}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold ml-auto">
                      <Zap size={12} />
                      +{daily.rewardPoints} XP
                    </div>
                  </div>
                  <button
                    onClick={() => !dailyDone && setActiveMode(GAME_MODES.find(m => m.id === (daily.question.type || 'quiz')))}
                    disabled={dailyDone}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      dailyDone
                        ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white'
                    }`}
                  >
                    {dailyDone ? 'Already Completed Today ✅' : 'Play Today\'s Challenge 🔥'}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center py-8 gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                  <p className="text-slate-400 text-sm">Loading today's challenge…</p>
                </div>
              )}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <Award size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Achievements</h2>
                <p className="text-slate-400 text-sm">
                  {achievements.filter(a => a.earned).length}/{achievements.length} unlocked
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(achievements.length ? achievements : ACHIEVEMENTS_DEF).map((a) => (
                <motion.div
                  key={a.achievementId || a.id}
                  whileHover={{ scale: 1.05 }}
                  className={`relative rounded-xl p-3 border text-center transition-all duration-200 ${
                    a.earned
                      ? 'bg-yellow-500/10 border-yellow-500/40 shadow-lg shadow-yellow-500/10'
                      : 'bg-slate-800/30 border-slate-700/40 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{a.icon}</div>
                  <p className="text-xs font-bold text-white leading-tight">{a.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight hidden sm:block">{a.description || a.desc}</p>
                  {a.earned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">✓</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* ── LEADERBOARD ── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Leaderboard</h2>
              <p className="text-slate-400 text-sm">Top players across CodeOrbit</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {['global', 'weekly'].map(tab => (
              <button
                key={tab}
                onClick={() => setLbTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                  lbTab === tab
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {tab === 'global' ? '🌍 Global' : '📅 Weekly'}
              </button>
            ))}
          </div>

          <div className="bg-slate-800/20 border border-slate-700/40 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-800/50 border-b border-slate-700/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-6">Player</div>
              <div className="col-span-3 text-right">Score</div>
              <div className="col-span-2 text-right">Games</div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <Trophy size={32} className="mx-auto mb-3 opacity-30" />
                <p>No scores yet. Be the first to play!</p>
              </div>
            ) : (
              leaderboard.map((row, i) => {
                const isMe = user && row.userId === user._id;
                const rankIcon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
                return (
                  <motion.div
                    key={row.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`grid grid-cols-12 gap-3 px-5 py-4 border-b border-slate-700/30 items-center transition-colors ${
                      isMe ? 'bg-indigo-500/10 border-indigo-500/20' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="col-span-1 text-center font-bold">
                      {rankIcon ? (
                        <span className="text-lg">{rankIcon}</span>
                      ) : (
                        <span className="text-slate-400 font-mono text-sm">#{row.rank}</span>
                      )}
                    </div>
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {row.avatar
                          ? <img src={row.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                          : row.name[0]?.toUpperCase()
                        }
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isMe ? 'text-indigo-300' : 'text-white'}`}>
                          {row.name} {isMe && <span className="text-xs text-indigo-400">(you)</span>}
                        </p>
                        <p className="text-xs text-slate-500">{row.xp.toLocaleString()} XP</p>
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                      <span className="font-bold text-yellow-400">{row.score.toLocaleString()}</span>
                      <span className="text-slate-500 text-xs ml-1">pts</span>
                    </div>
                    <div className="col-span-2 text-right text-slate-400 text-sm">{row.games}</div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* ── REWARDS / LEVEL SYSTEM ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Star size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Rewards System</h2>
              <p className="text-slate-400 text-sm">Earn XP, level up, unlock badges</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Current level card */}
            <div className={`bg-gradient-to-br ${levelInfo.color} p-[1px] rounded-2xl`}>
              <div className="bg-[#0f1929] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Current Level</p>
                    <h3 className={`text-3xl font-black ${levelInfo.text}`}>{levelInfo.icon} {levelInfo.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Total XP</p>
                    <p className="text-2xl font-black text-white">{(stats?.user?.xp ?? 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-2">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${levelInfo.color} transition-all duration-1000`}
                    style={{ width: `${Math.min(levelInfo.pct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>{stats?.user?.xp ?? 0} XP</span>
                  <span>{levelInfo.nextMin} XP needed for {levelInfo.nextName}</span>
                </div>
              </div>
            </div>

            {/* XP sources */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" /> How to Earn XP
              </h4>
              <div className="space-y-3">
                {[
                  { src: '🧠 Quiz Correct Answer', pts: '+10 XP' },
                  { src: '🐛 Bug Hunter Solved', pts: '+20 XP' },
                  { src: '⚡ Speed Challenge', pts: '+15 XP + time bonus' },
                  { src: '📈 Complexity Correct', pts: '+10 XP' },
                  { src: '🌟 Daily Challenge', pts: '+50 XP' },
                  { src: '🎯 Pattern Recognized', pts: '+10 XP' },
                ].map(({ src, pts }) => (
                  <div key={src} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{src}</span>
                    <span className="text-yellow-400 font-bold font-mono">{pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Level progression */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LEVELS.map((l) => {
              const current = stats?.user?.xp ?? 0;
              const unlocked = current >= l.min;
              return (
                <div
                  key={l.name}
                  className={`rounded-xl p-4 border text-center transition-all ${
                    unlocked
                      ? `bg-gradient-to-br ${l.color} bg-opacity-10 border-opacity-50`
                      : 'bg-slate-800/20 border-slate-700/30 opacity-50 grayscale'
                  }`}
                  style={unlocked ? {} : {}}
                >
                  <div className="text-3xl mb-2">{l.icon}</div>
                  <p className={`font-bold text-sm ${l.text}`}>{l.name}</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{l.min.toLocaleString()} XP</p>
                  {unlocked && <div className="mt-2 text-green-400 text-xs font-bold">✓ Unlocked</div>}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default GameZone;
