import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, FileText, Upload, Sparkles, Send, Bot, User, CheckCircle, RefreshCw, Star, Code, Layers
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const ResumePrep = () => {
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState('');
  const [status, setStatus] = useState('input'); // input | running | completed
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Parsed Resume Metadata
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  // Scores
  const [scores, setScores] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Handle local file read (Txt, Md, Json, etc.)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleStartResumeInterview = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setStatus('running');
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/api/interview/resume', {
        resumeText
      });
      setSessionId(response.data.sessionId);
      setMessages(response.data.chatHistory || []);
      setSkills(response.data.parsedSkills || []);
      setProjects(response.data.parsedProjects || []);
    } catch (err) {
      console.error('Error starting resume interview:', err);
      setStatus('input');
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
      const response = await axiosClient.post('/api/interview/resume', {
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
      console.error('Error sending message:', err);
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
        
        {/* INPUT SCREEN */}
        {status === 'input' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/interview')}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-3xl font-black text-white">Resume-Based Mock Interview</h1>
                <p className="text-slate-400 text-xs mt-1">Upload or paste your resume. CodeOrbit AI will analyze your projects/skills and interview you on them.</p>
              </div>
            </div>

            <form onSubmit={handleStartResumeInterview} className="bg-[#0c1220] border border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Paste Resume Content / Markdown</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Upload size={13} /> Import Text File
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md,.json"
                    className="hidden"
                  />
                </div>

                <textarea
                  rows={10}
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="e.g.&#10;John Doe - Software Engineer&#10;Skills: React, Node.js, Express, MongoDB, Java&#10;Projects:&#10;1. CodeOrbit: A competitive programming system built using Socket.io and Redis. Optimized compilation throughput by 30%..."
                  className="w-full bg-[#080d18] border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-purple-500 text-sm leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!resumeText.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 hover:shadow-purple-700/60 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Parse Resume & Start Mock Interview
              </button>
            </form>
          </div>
        )}

        {/* RUNNING CHAT RUNNER */}
        {status === 'running' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[75vh]">
            
            {/* Left sidebar: parsed info */}
            <div className="hidden lg:block lg:col-span-4 bg-[#0c1220] border border-slate-800/80 rounded-2xl p-5 overflow-y-auto space-y-6">
              <h3 className="text-white font-bold text-sm border-b border-slate-800 pb-2.5 uppercase tracking-widest text-purple-400">Parsed Resume Metadata</h3>
              
              {skills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><Code size={12} /> Key Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => (
                      <span key={s} className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {projects.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><Layers size={12} /> Projects Found</span>
                  <div className="space-y-3">
                    {projects.map((p, idx) => (
                      <div key={idx} className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl space-y-1">
                        <span className="text-white font-bold text-xs">{p.title}</span>
                        <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-3">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chat Session */}
            <div className="lg:col-span-8 flex flex-col bg-[#0c1220] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl h-full">
              {/* Header */}
              <div className="shrink-0 px-5 py-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white uppercase tracking-wider">AI Resume Reviewer</span>
                    <span className="text-[10px] text-emerald-400 block font-medium">Progressing Resume Mock • {formatTime(timeElapsed)}</span>
                  </div>
                </div>
                <button
                  onClick={() => { if(window.confirm('Abandon resume mock session?')) setStatus('input'); }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-xl text-xs font-bold text-slate-400 transition-colors"
                >
                  Quit
                </button>
              </div>

              {/* Chat Thread */}
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

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="shrink-0 p-4 border-t border-slate-800 bg-[#0c1220] flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Defend your project design choice..."
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

          </div>
        )}

        {/* COMPLETED SCREEN */}
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
              <h2 className="text-2xl font-black text-white">Resume Mock Interview Evaluated!</h2>
              <p className="text-slate-400 text-xs">Based on how well you explained your projects, system designs, and technical skills.</p>
            </div>

            {/* Score pill */}
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
              <h4 className="text-white font-bold text-sm uppercase tracking-widest text-slate-400">Review Summary</h4>
              <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl text-slate-200 text-sm leading-relaxed">
                {feedback}
              </div>
            </div>

            {/* Suggestions */}
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

            {/* CTA */}
            <div className="flex gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => { setStatus('input'); setResumeText(''); }}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} /> Start Another Resume Prep
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

export default ResumePrep;
