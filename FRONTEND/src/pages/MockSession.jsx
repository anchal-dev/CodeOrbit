import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bot, User, Send, Star, CheckCircle, Award, RefreshCw, AlertCircle, Sparkles, TrendingUp
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const MODES = [
  { id: 'dsa', name: 'DSA Interview', desc: 'Focuses on complex data structures, algorithms, and complexity analysis.', icon: '🧠' },
  { id: 'frontend', name: 'Frontend Interview', desc: 'HTML, CSS, JS, frameworks (React/Vue), browser performance, and rendering APIs.', icon: '🎨' },
  { id: 'backend', name: 'Backend Interview', desc: 'System design, database transactions, concurrency, messaging queues, and caching.', icon: '⚙️' },
  { id: 'fullstack', name: 'Full Stack Interview', desc: 'Covers end-to-end applications, state sync, API structures, and basic deployments.', icon: '🌐' },
  { id: 'core', name: 'Core CS Interview', desc: 'Operating Systems (Paging, Threading), DBMS (ACID, Normalization), and Computer Networks.', icon: '🖥' },
  { id: 'behavioral', name: 'Behavioral Interview', desc: 'STAR format situational questions, teamwork, conflict resolutions, and leadership stories.', icon: '🤝' }
];

const MockSession = () => {
  const navigate = useNavigate();

  const [selectedMode, setSelectedMode] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState('setup'); // setup | running | completed | evaluating
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Completed metrics
  const [scores, setScores] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    let t;
    if (status === 'running') {
      t = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartInterview = async (mode) => {
    setSelectedMode(mode);
    setStatus('running');
    setIsLoading(true);
    try {
      const response = await axiosClient.post('/api/interview/mock', { mode });
      setSessionId(response.data.sessionId);
      setMessages(response.data.chatHistory || []);
    } catch (err) {
      console.error('Error starting mock session:', err);
      setStatus('setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setIsLoading(true);

    // Optimistically update message history
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    try {
      const response = await axiosClient.post('/api/interview/mock', {
        sessionId,
        userMessage: userMsg
      });

      if (response.data.status === 'completed') {
        setStatus('completed');
        setScores(response.data.scores);
        setFeedback(response.data.feedback);
        setSuggestions(response.data.suggestions || []);
        if (response.data.chatHistory) {
          setMessages(response.data.chatHistory);
        }
      } else {
        setMessages(response.data.chatHistory || []);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100 pb-20 pt-24 font-sans flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 flex-1 flex flex-col justify-center space-y-6">
        
        {/* SETUP SCREEN */}
        {status === 'setup' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/interview')}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-3xl font-black text-white">AI Mock Interview Coach</h1>
                <p className="text-slate-400 text-xs mt-1">Select an interview mode to start a 5-question mock session</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleStartInterview(mode.id)}
                  className="bg-[#0f172a]/60 border border-slate-800/80 p-5 rounded-2xl text-left hover:border-purple-500/40 hover:bg-slate-900/20 group transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-purple-500/10 rounded-xl block">{mode.icon}</span>
                    <div>
                      <span className="text-white font-bold text-base block group-hover:text-purple-300 transition-colors">{mode.name}</span>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{mode.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RUNNING CHAT RUNNER */}
        {status === 'running' && (
          <div className="flex-1 flex flex-col h-[70vh] bg-[#0c1220] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
            {/* Session Header */}
            <div className="shrink-0 px-5 py-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <span className="text-sm font-bold text-white uppercase tracking-wider">AI Interviewer</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">Session in progress • {formatTime(timeElapsed)}</span>
                </div>
              </div>
              <button
                onClick={() => { if(window.confirm('End interview session early? No score will be saved.')) setStatus('setup'); }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-xl text-xs font-bold text-slate-400 transition-colors"
              >
                Quit Session
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((m, i) => {
                const isAI = m.role === 'assistant';
                return (
                  <div key={i} className={`flex gap-3 max-w-[85%] ${isAI ? '' : 'ml-auto flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isAI ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {isAI ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isAI ? 'bg-slate-900/60 border border-slate-800/80 text-slate-100 rounded-tl-none' : 'bg-purple-600 text-white rounded-tr-none'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl text-sm text-slate-400 rounded-tl-none flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="shrink-0 p-4 border-t border-slate-800 bg-[#0c1220] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your response here..."
                className="flex-1 bg-[#080d18] border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-purple-500 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl disabled:opacity-40 disabled:hover:bg-purple-600 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {/* COMPLETED/EVALUATION SUMMARY */}
        {status === 'completed' && scores && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0c1220] border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
          >
            <div className="text-center space-y-2 border-b border-slate-800 pb-5">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
                <Sparkles size={32} />
              </div>
              <h2 className="text-2xl font-black text-white">Interview Assessment Complete!</h2>
              <p className="text-slate-400 text-xs">Your mock interview report card is ready. Points added to your overall Orbit Coins.</p>
            </div>

            {/* Scores grids */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Communication</span>
                <span className="text-2xl font-black text-blue-400 block">{scores.communication}</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Technical Depth</span>
                <span className="text-2xl font-black text-emerald-400 block">{scores.technical}</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Confidence</span>
                <span className="text-2xl font-black text-orange-400 block">{scores.confidence}</span>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase block tracking-wider">Overall Score</span>
                <span className="text-2xl font-black text-purple-300 block">{scores.overall}</span>
              </div>
            </div>

            {/* Detailed feedback */}
            <div className="space-y-2.5">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest text-slate-400">Detailed Feedback</h4>
              <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl text-slate-200 text-sm leading-relaxed">
                {feedback}
              </div>
            </div>

            {/* Suggestions for improvement */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest text-slate-400">Suggestions for Improvement</h4>
                <ul className="space-y-2">
                  {suggestions.map((sug, i) => (
                    <li key={i} className="flex gap-2 text-slate-300 text-sm">
                      <CheckCircle size={15} className="text-purple-400 mt-0.5 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setStatus('setup')}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} /> Start Another Session
              </button>
              <button
                onClick={() => navigate('/interview')}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold rounded-xl transition-colors"
              >
                Back to Interview Hub
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default MockSession;
