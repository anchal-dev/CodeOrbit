import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, Zap, Target } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

const PatternRecognition = ({ onClose, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore]       = useState(0);
  const [correct, setCorrect]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [phase, setPhase]       = useState('loading');

  useEffect(() => {
    axiosClient.get('/api/game/challenges?type=pattern&limit=10')
      .then(({ data }) => { setQuestions(data.questions); setPhase('playing'); })
      .catch(() => setPhase('error'));
  }, []);

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    setTimeout(() => nextQuestion(), 1500);
  }, [answered]);

  useEffect(() => {
    if (phase !== 'playing' || answered) return;
    if (timeLeft <= 0) { handleTimeout(); return; }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, answered, handleTimeout]);

  const nextQuestion = () => {
    const next = current + 1;
    if (next >= questions.length) setPhase('result');
    else { setCurrent(next); setSelected(null); setAnswered(false); setTimeLeft(30); }
  };

  const handleSelect = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const q = questions[current];
    const isCorrect = opt === q.answer;
    if (isCorrect) { setScore(s => s + (q.points || 10)); setCorrect(c => c + 1); }
    setTimeout(() => nextQuestion(), 1200);
  };

  const handleFinish = async () => {
    try {
      await axiosClient.post('/api/game/submit', {
        gameType: 'pattern', score, correctAnswers: correct,
        totalQuestions: questions.length, timeTaken: 0
      });
    } catch (_) {}
    onComplete?.({ score, correct, total: questions.length });
    onClose();
  };

  const PATTERN_ICONS = {
    'Two Pointers': '👉👈', 'Sliding Window': '🪟', 'Binary Search': '🔢',
    'DFS': '🌊', 'BFS': '🔄', 'Greedy': '💰', 'DP': '📊',
    'Backtracking': '↩️', 'Monotonic Stack': '📚', 'Stack': '📦',
    'Min-Heap of size K': '🔻', 'DFS with Backtracking': '🗺️',
    'Modified Binary Search': '🔍', 'BFS/DFS': '🌐', 'Hash Map': '🗝️',
  };

  const q = questions[current];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h2 className="text-white font-bold text-lg">Pattern Recognition</h2>
            <p className="text-slate-400 text-xs">Identify the algorithm • 30s each</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {phase === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
          </div>
        )}

        {phase === 'playing' && q && (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }} transition={{ duration:0.25 }} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full transition-all" style={{ width:`${(current/Math.max(questions.length,1))*100}%` }} />
                </div>
                <span className="text-slate-400 text-xs font-mono">{current+1}/{questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-full px-3 py-1.5">
                  <Clock size={14} className={timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-slate-400'} />
                  <span className={`text-sm font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-300'}`}>{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-full px-3 py-1.5">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-sm font-mono font-bold text-yellow-400">{score} pts</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-pink-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-pink-400" />
                  <span className="text-pink-300 text-xs font-semibold uppercase tracking-wider">Problem Statement</span>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed font-medium">{q.question}</p>
              </div>

              <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Which algorithm pattern should you use?</p>
              <div className="grid grid-cols-2 gap-2.5">
                {q.options?.map((opt, i) => {
                  const icon = PATTERN_ICONS[opt] || '⚡';
                  let style = 'border-slate-700/50 bg-slate-800/30 hover:border-pink-500/40 hover:bg-pink-500/5';
                  if (answered) {
                    if (opt === q.answer) style = 'border-green-500/60 bg-green-500/10';
                    else if (opt === selected) style = 'border-red-500/60 bg-red-500/10';
                    else style = 'border-slate-700/20 opacity-40';
                  }
                  return (
                    <button key={i} onClick={() => handleSelect(opt)} disabled={answered}
                      className={`w-full py-3 px-3 rounded-xl border transition-all duration-200 text-sm font-medium text-slate-200 flex items-center gap-2 ${style}`}
                    >
                      <span className="text-lg">{icon}</span>
                      <span className="text-left leading-tight">{opt}</span>
                      {answered && opt === q.answer && <CheckCircle size={14} className="text-green-400 ml-auto shrink-0" />}
                      {answered && opt === selected && opt !== q.answer && <XCircle size={14} className="text-red-400 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {answered && q.explanation && (
                <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
                  className="bg-slate-700/40 border border-slate-600/50 rounded-xl p-3"
                >
                  <p className="text-slate-300 text-sm leading-relaxed">🎯 {q.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {phase === 'result' && (
          <motion.div initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }} className="flex flex-col items-center gap-6 py-4">
            <div className="text-6xl">{correct >= 8 ? '🎯✅' : '🧩'}</div>
            <h3 className="text-2xl font-black text-white">Pattern Master!</h3>
            <div className="w-full grid grid-cols-3 gap-3">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-pink-400">{correct}</div>
                <div className="text-xs text-slate-400 mt-1">Correct</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-yellow-400">{score}</div>
                <div className="text-xs text-slate-400 mt-1">XP Earned</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-purple-400">{Math.round((correct/Math.max(questions.length,1))*100)}%</div>
                <div className="text-xs text-slate-400 mt-1">Accuracy</div>
              </div>
            </div>
            <button onClick={handleFinish}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-200"
            >
              Claim XP & Close
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PatternRecognition;
