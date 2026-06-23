import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, Zap, Bug } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

const BugHunter = ({ onClose, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore]       = useState(0);
  const [correct, setCorrect]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [phase, setPhase]       = useState('loading');

  useEffect(() => {
    axiosClient.get('/api/game/challenges?type=bug&limit=10')
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
    else {
      setCurrent(next); setSelected(null);
      setAnswered(false); setTimeLeft(90);
    }
  };

  const handleSelect = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const q = questions[current];
    const isCorrect = opt === q.answer;
    if (isCorrect) { setScore(s => s + (q.points || 20)); setCorrect(c => c + 1); }
    setTimeout(() => nextQuestion(), 1500);
  };

  const handleFinish = async () => {
    try {
      await axiosClient.post('/api/game/submit', {
        gameType: 'bug', score, correctAnswers: correct,
        totalQuestions: questions.length, timeTaken: 0
      });
    } catch (_) {}
    onComplete?.({ score, correct, total: questions.length });
    onClose();
  };

  const q = questions[current];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐛</span>
          <div>
            <h2 className="text-white font-bold text-lg">Bug Hunter</h2>
            <p className="text-slate-400 text-xs">Find the bug • 90s per challenge</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {phase === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          </div>
        )}

        {phase === 'error' && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <XCircle className="text-red-400" size={40} />
            <p className="text-slate-300">Failed to load challenges.</p>
          </div>
        )}

        {phase === 'playing' && q && (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-30 }} transition={{ duration:0.25 }} className="flex flex-col gap-4">
              {/* Progress + stats */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all" style={{ width:`${(current/Math.max(questions.length,1))*100}%` }} />
                </div>
                <span className="text-slate-400 text-xs font-mono">{current+1}/{questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-full px-3 py-1.5">
                  <Clock size={14} className={timeLeft <= 20 ? 'text-red-400 animate-pulse' : 'text-slate-400'} />
                  <span className={`text-sm font-mono font-bold ${timeLeft <= 20 ? 'text-red-400' : 'text-slate-300'}`}>{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-full px-3 py-1.5">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-sm font-mono font-bold text-yellow-400">{score} pts</span>
                </div>
              </div>

              {/* Question */}
              <div className="bg-slate-800/40 border border-orange-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bug size={16} className="text-orange-400" />
                  <p className="text-slate-100 font-semibold">{q.question}</p>
                </div>
              </div>

              {/* Code block */}
              {q.codeSnippet && (
                <div className="bg-[#0d1117] border border-slate-700 rounded-xl overflow-x-auto">
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    <span className="text-slate-400 text-xs ml-2 font-mono">buggy_code.cpp</span>
                  </div>
                  <pre className="p-4 text-sm text-slate-200 font-mono overflow-x-auto leading-relaxed"><code>{q.codeSnippet}</code></pre>
                </div>
              )}

              {/* Options */}
              <div className="flex flex-col gap-2.5">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">What is the bug?</p>
                {q.options?.map((opt, i) => {
                  let style = 'border-slate-700/50 bg-slate-800/30 hover:border-orange-500/40 hover:bg-orange-500/5';
                  if (answered) {
                    if (opt === q.answer) style = 'border-green-500/60 bg-green-500/10';
                    else if (opt === selected) style = 'border-red-500/60 bg-red-500/10';
                    else style = 'border-slate-700/20 opacity-40';
                  }
                  return (
                    <button key={i} onClick={() => handleSelect(opt)} disabled={answered}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm text-slate-200 ${style}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono text-xs">{String.fromCharCode(65+i)}.</span>
                        {opt}
                        {answered && opt === q.answer && <CheckCircle size={14} className="text-green-400 ml-auto shrink-0" />}
                        {answered && opt === selected && opt !== q.answer && <XCircle size={14} className="text-red-400 ml-auto shrink-0" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {answered && q.explanation && (
                <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
                  className="bg-slate-700/40 border border-slate-600/50 rounded-xl p-3"
                >
                  <p className="text-slate-300 text-sm leading-relaxed">🔍 {q.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {phase === 'result' && (
          <motion.div initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }} className="flex flex-col items-center gap-6 py-4">
            <div className="text-center">
              <div className="text-6xl mb-3">{correct >= 7 ? '🐛✅' : correct >= 4 ? '🔍' : '💪'}</div>
              <h3 className="text-2xl font-black text-white">Bug Hunt Complete!</h3>
              <p className="text-slate-400 text-sm mt-1">You found {correct} out of {questions.length} bugs</p>
            </div>
            <div className="w-full grid grid-cols-3 gap-3">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-orange-400">{correct}</div>
                <div className="text-xs text-slate-400 mt-1">Bugs Found</div>
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
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-xl transition-all duration-200"
            >
              Claim XP & Close
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BugHunter;
