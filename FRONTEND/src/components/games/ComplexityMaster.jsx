import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

const ComplexityMaster = ({ onClose, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore]       = useState(0);
  const [correct, setCorrect]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [phase, setPhase]       = useState('loading');

  useEffect(() => {
    axiosClient.get('/api/game/challenges?type=complexity&limit=10')
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
    else { setCurrent(next); setSelected(null); setAnswered(false); setTimeLeft(25); }
  };

  const handleSelect = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const q = questions[current];
    const isCorrect = opt === q.answer;
    if (isCorrect) setScore(s => s + (q.points || 10));
    if (isCorrect) setCorrect(c => c + 1);
    setTimeout(() => nextQuestion(), 1200);
  };

  const handleFinish = async () => {
    try {
      await axiosClient.post('/api/game/submit', {
        gameType: 'complexity', score, correctAnswers: correct,
        totalQuestions: questions.length, timeTaken: 0
      });
    } catch (_) {}
    onComplete?.({ score, correct, total: questions.length });
    onClose();
  };

  const q = questions[current];

  const COMPLEXITY_COLORS = {
    'O(1)': 'text-green-400', 'O(log N)': 'text-blue-400', 'O(N)': 'text-yellow-400',
    'O(N log N)': 'text-orange-400', 'O(N²)': 'text-red-400', 'O(2^N)': 'text-red-500',
    'O(N + K)': 'text-blue-300', 'O(N + E)': 'text-blue-300', 'O(V + E)': 'text-purple-400',
    'O(M×N)': 'text-orange-400', 'O(N³)': 'text-red-400', 'O(E log V)': 'text-purple-400'
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📈</span>
          <div>
            <h2 className="text-white font-bold text-lg">Complexity Master</h2>
            <p className="text-slate-400 text-xs">Guess the Big-O • 25s each</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {phase === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        )}

        {phase === 'playing' && q && (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }} transition={{ duration:0.25 }} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all" style={{ width:`${(current/Math.max(questions.length,1))*100}%` }} />
                </div>
                <span className="text-slate-400 text-xs font-mono">{current+1}/{questions.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-full px-3 py-1.5">
                  <Clock size={14} className={timeLeft <= 8 ? 'text-red-400 animate-pulse' : 'text-slate-400'} />
                  <span className={`text-sm font-mono font-bold ${timeLeft <= 8 ? 'text-red-400' : 'text-slate-300'}`}>{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-full px-3 py-1.5">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-sm font-mono font-bold text-yellow-400">{score} pts</span>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-blue-500/20 rounded-xl p-4">
                <p className="text-slate-300 text-sm mb-3 font-medium">{q.question}</p>
                {q.codeSnippet && (
                  <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-sm text-slate-200 overflow-x-auto border border-slate-700">
                    <pre>{q.codeSnippet}</pre>
                  </div>
                )}
              </div>

              {/* Big-O buttons */}
              <div className="grid grid-cols-2 gap-3">
                {q.options?.map((opt, i) => {
                  const optColor = COMPLEXITY_COLORS[opt] || 'text-slate-300';
                  let style = 'border-slate-700/50 bg-slate-800/30 hover:border-blue-400/50 hover:bg-blue-500/10';
                  if (answered) {
                    if (opt === q.answer) style = 'border-green-500/60 bg-green-500/10';
                    else if (opt === selected) style = 'border-red-500/60 bg-red-500/10';
                    else style = 'border-slate-700/20 opacity-40';
                  }
                  return (
                    <button key={i} onClick={() => handleSelect(opt)} disabled={answered}
                      className={`w-full py-4 rounded-xl border-2 font-bold font-mono text-lg transition-all duration-200 flex items-center justify-center gap-2 ${style} ${optColor}`}
                    >
                      {opt}
                      {answered && opt === q.answer && <CheckCircle size={16} className="text-green-400" />}
                      {answered && opt === selected && opt !== q.answer && <XCircle size={16} className="text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {answered && q.explanation && (
                <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
                  className="bg-slate-700/40 border border-slate-600/50 rounded-xl p-3"
                >
                  <p className="text-slate-300 text-sm leading-relaxed">💡 {q.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {phase === 'result' && (
          <motion.div initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }} className="flex flex-col items-center gap-6 py-4">
            <div className="text-6xl mb-2">{correct >= 8 ? '🧮✅' : '📊'}</div>
            <h3 className="text-2xl font-black text-white">Round Complete!</h3>
            <div className="w-full grid grid-cols-3 gap-3">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-blue-400">{correct}</div>
                <div className="text-xs text-slate-400 mt-1">Correct</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-yellow-400">{score}</div>
                <div className="text-xs text-slate-400 mt-1">XP Earned</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-cyan-400">{Math.round((correct/Math.max(questions.length,1))*100)}%</div>
                <div className="text-xs text-slate-400 mt-1">Accuracy</div>
              </div>
            </div>
            <button onClick={handleFinish}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-200"
            >
              Claim XP & Close
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComplexityMaster;
