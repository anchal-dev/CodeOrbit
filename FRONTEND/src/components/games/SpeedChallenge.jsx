import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Zap, Timer } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

// Speed challenge uses the DSA quiz questions but with strict 15s countdown
const SpeedChallenge = ({ onClose, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore]       = useState(0);
  const [correct, setCorrect]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [totalTime, setTotalTime] = useState(0);
  const [phase, setPhase]       = useState('loading');
  const [streak, setStreak]     = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    // Mix of quiz + complexity for speed rounds
    axiosClient.get('/api/game/challenges?type=quiz&limit=10&difficulty=easy')
      .then(({ data }) => { setQuestions(data.questions); setPhase('playing'); })
      .catch(() => setPhase('error'));
  }, []);

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    setStreak(0);
    setTimeout(() => nextQuestion(), 1000);
  }, [answered]);

  useEffect(() => {
    if (phase !== 'playing' || answered) return;
    if (timeLeft <= 0) { handleTimeout(); return; }
    const t = setTimeout(() => { setTimeLeft(tl => tl - 1); setTotalTime(tt => tt + 1); }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, answered, handleTimeout]);

  const nextQuestion = () => {
    const next = current + 1;
    if (next >= questions.length) setPhase('result');
    else { setCurrent(next); setSelected(null); setAnswered(false); setTimeLeft(15); }
  };

  const handleSelect = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const q = questions[current];
    const isCorrect = opt === q.answer;
    const timeBonus = timeLeft * 2; // bonus for answering fast
    if (isCorrect) {
      const pts = (q.points || 15) + timeBonus;
      setScore(s => s + pts);
      setCorrect(c => c + 1);
      setStreak(s => {
        const ns = s + 1;
        setMaxStreak(ms => Math.max(ms, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
    setTimeout(() => nextQuestion(), 800);
  };

  const handleFinish = async () => {
    try {
      await axiosClient.post('/api/game/submit', {
        gameType: 'speed', score, correctAnswers: correct,
        totalQuestions: questions.length, timeTaken: totalTime
      });
    } catch (_) {}
    onComplete?.({ score, correct, total: questions.length });
    onClose();
  };

  const q = questions[current];
  const urgency = timeLeft <= 5;
  const timerPct = (timeLeft / 15) * 100;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h2 className="text-white font-bold text-lg">Speed Challenge</h2>
            <p className="text-slate-400 text-xs">15s per question • Time bonus points</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {phase === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
          </div>
        )}

        {phase === 'playing' && q && (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity:0,scale:0.97 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0,scale:1.03 }} transition={{ duration:0.2 }} className="flex flex-col gap-4">
              {/* Countdown ring */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#1e293b" strokeWidth="4" />
                      <circle cx="28" cy="28" r="24" fill="none"
                        stroke={urgency ? '#ef4444' : '#eab308'}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - timerPct / 100)}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-lg font-black ${urgency ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                      {timeLeft}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Q{current+1}/{questions.length}</div>
                    {streak >= 2 && (
                      <div className="text-xs text-orange-400 font-bold">🔥 {streak}x Streak!</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-full px-3 py-1.5">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-sm font-mono font-bold text-yellow-400">{score} pts</span>
                </div>
              </div>

              {/* Question */}
              <div className={`bg-slate-800/40 border rounded-xl p-4 transition-all ${urgency ? 'border-red-500/40' : 'border-yellow-500/20'}`}>
                <p className="text-slate-100 text-sm font-medium leading-relaxed">{q.question}</p>
              </div>

              {/* Options — 2x2 grid for speed */}
              <div className="grid grid-cols-2 gap-2.5">
                {q.options?.map((opt, i) => {
                  let style = 'border-slate-700/50 bg-slate-800/30 hover:border-yellow-400/50 hover:bg-yellow-500/5';
                  if (answered) {
                    if (opt === q.answer) style = 'border-green-500/60 bg-green-500/10';
                    else if (opt === selected) style = 'border-red-500/60 bg-red-500/10';
                    else style = 'border-slate-700/20 opacity-40';
                  }
                  return (
                    <button key={i} onClick={() => handleSelect(opt)} disabled={answered}
                      className={`w-full py-4 px-3 rounded-xl border-2 text-sm font-semibold text-slate-200 transition-all duration-150 text-center ${style}`}
                    >
                      {opt}
                      {answered && opt === q.answer && <CheckCircle size={14} className="text-green-400 inline ml-1" />}
                      {answered && opt === selected && opt !== q.answer && <XCircle size={14} className="text-red-400 inline ml-1" />}
                    </button>
                  );
                })}
              </div>

              {/* Time bonus indicator */}
              {answered && selected === q?.answer && (
                <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }}
                  className="text-center text-green-400 font-bold text-sm"
                >
                  +{(q.points || 15) + timeLeft * 2} pts (includes {timeLeft * 2} time bonus!)
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {phase === 'result' && (
          <motion.div initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }} className="flex flex-col items-center gap-6 py-4">
            <div className="text-6xl">{correct >= 8 ? '⚡🏆' : '⚡'}</div>
            <h3 className="text-2xl font-black text-white">Speed Round Done!</h3>
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-yellow-400">{score}</div>
                <div className="text-xs text-slate-400 mt-1">Total XP</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-green-400">{correct}/{questions.length}</div>
                <div className="text-xs text-slate-400 mt-1">Correct</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-orange-400">{maxStreak}x</div>
                <div className="text-xs text-slate-400 mt-1">Best Streak</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-cyan-400">{totalTime}s</div>
                <div className="text-xs text-slate-400 mt-1">Total Time</div>
              </div>
            </div>
            <button onClick={handleFinish}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 font-black rounded-xl transition-all duration-200"
            >
              Claim XP & Close ⚡
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SpeedChallenge;
