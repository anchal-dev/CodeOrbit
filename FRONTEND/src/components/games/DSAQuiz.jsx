import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, Zap, ChevronRight } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

const DSAQuiz = ({ onClose, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore]       = useState(0);
  const [correct, setCorrect]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [phase, setPhase]       = useState('loading'); // loading | playing | result
  const [results, setResults]   = useState([]);

  useEffect(() => {
    axiosClient.get('/api/game/challenges?type=quiz&limit=10')
      .then(({ data }) => { setQuestions(data.questions); setPhase('playing'); })
      .catch(() => setPhase('error'));
  }, []);

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    const q = questions[current];
    setResults(prev => [...prev, { question: q.question, correct: false, answer: q.answer, selected: null }]);
    setTimeout(() => nextQuestion(), 1500);
  }, [answered, current, questions]);

  useEffect(() => {
    if (phase !== 'playing' || answered) return;
    if (timeLeft <= 0) { handleTimeout(); return; }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, answered, handleTimeout]);

  const nextQuestion = () => {
    const next = current + 1;
    if (next >= questions.length) {
      setPhase('result');
    } else {
      setCurrent(next);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(30);
    }
  };

  const handleSelect = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const q = questions[current];
    const isCorrect = opt === q.answer;
    if (isCorrect) { setScore(s => s + q.points); setCorrect(c => c + 1); }
    setResults(prev => [...prev, { question: q.question, correct: isCorrect, answer: q.answer, selected: opt }]);
    setTimeout(() => nextQuestion(), 1200);
  };

  const handleFinish = async () => {
    try {
      await axiosClient.post('/api/game/submit', {
        gameType: 'quiz', score, correctAnswers: correct,
        totalQuestions: questions.length, timeTaken: 0
      });
    } catch (_) {}
    onComplete?.({ score, correct, total: questions.length });
    onClose();
  };

  const q = questions[current];
  const pct = questions.length ? Math.round((current / questions.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <h2 className="text-white font-bold text-lg">DSA Quiz Arena</h2>
            <p className="text-slate-400 text-xs">{questions.length} questions • 30s each</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {phase === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          </div>
        )}

        {phase === 'error' && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <XCircle className="text-red-400" size={40} />
            <p className="text-slate-300">Failed to load questions. Please try again.</p>
            <button onClick={onClose} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Close</button>
          </div>
        )}

        {phase === 'playing' && q && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-slate-400 text-xs font-mono">{current + 1}/{questions.length}</span>
              </div>

              {/* Timer + Score */}
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

              {/* Topic badge */}
              {q.topic && (
                <span className="self-start px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {q.topic}
                </span>
              )}

              {/* Question */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-100 text-base font-medium leading-relaxed">{q.question}</p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {q.options?.map((opt, i) => {
                  let style = 'border-slate-700/50 bg-slate-800/30 hover:border-purple-500/50 hover:bg-purple-500/10';
                  if (answered) {
                    if (opt === q.answer) style = 'border-green-500/70 bg-green-500/15';
                    else if (opt === selected) style = 'border-red-500/70 bg-red-500/15';
                    else style = 'border-slate-700/30 bg-slate-800/20 opacity-50';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt)}
                      disabled={answered}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium text-slate-200 ${style}`}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-400">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                        {answered && opt === q.answer && <CheckCircle size={16} className="text-green-400 ml-auto" />}
                        {answered && opt === selected && opt !== q.answer && <XCircle size={16} className="text-red-400 ml-auto" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {answered && q.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-700/40 border border-slate-600/50 rounded-xl p-3"
                >
                  <p className="text-slate-300 text-sm leading-relaxed">💡 {q.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {phase === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-4"
          >
            <div className="text-center">
              <div className="text-6xl mb-3">{correct >= 8 ? '🏆' : correct >= 5 ? '⭐' : '💪'}</div>
              <h3 className="text-2xl font-black text-white mb-1">Quiz Complete!</h3>
              <p className="text-slate-400 text-sm">Here's how you did</p>
            </div>
            <div className="w-full grid grid-cols-3 gap-3">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-green-400">{correct}</div>
                <div className="text-xs text-slate-400 mt-1">Correct</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-yellow-400">{score}</div>
                <div className="text-xs text-slate-400 mt-1">XP Earned</div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-purple-400">{Math.round((correct/questions.length)*100)}%</div>
                <div className="text-xs text-slate-400 mt-1">Accuracy</div>
              </div>
            </div>
            {/* Review list */}
            <div className="w-full max-h-48 overflow-y-auto flex flex-col gap-2">
              {results.map((r, i) => (
                <div key={i} className={`flex items-start gap-2 p-3 rounded-xl text-sm border ${r.correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  {r.correct ? <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" /> : <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />}
                  <p className="text-slate-300 line-clamp-2">{r.question}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleFinish}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Claim XP & Close <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DSAQuiz;
