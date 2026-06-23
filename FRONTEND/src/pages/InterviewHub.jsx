import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Star, Award, BookOpen, Users, Compass, ChevronRight,
  TrendingUp, Clock, Plus, Share2, Shield, Heart, FileText, CheckCircle,
  Play, MessageSquare, Code2, Cpu, Database, Globe, Layers, AlertCircle,
  ExternalLink
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const BEHAVIORAL_QUESTIONS = [
  {
    category: 'Tell me about yourself',
    q: 'Can you walk me through your resume?',
    tips: 'Focus on your journey, key technical achievements, and why you are interested in this specific role. Use the Present-Past-Future framework.',
    mistakes: 'Do not recite your resume line by line or go into overly personal details.',
    sample: 'I am a software engineer specializing in full-stack web applications. Recently, I built CodeOrbit, a competitive programming platform using MERN & Redis, scaling user engagement by 40%. Previously, I interned at Tech Corp where I optimized API latency. I am excited about this role because it aligns with my passion for high-performance system design.'
  },
  {
    category: 'Strengths',
    q: 'What is your greatest professional strength?',
    tips: 'Choose a strength relevant to software engineering (e.g. quick learning, debugging, system design) and support it with a real example.',
    mistakes: 'Avoid generic answers like "I am a hard worker" without supporting evidence.',
    sample: 'My greatest strength is my ability to quickly adapt and learn new technologies. When building our real-time judge compiler, I had zero experience with sandboxed execution. Within a week, I researched Docker API and secure code runtimes to implement a robust solution.'
  },
  {
    category: 'Weaknesses',
    q: 'What is your greatest weakness?',
    tips: 'Mention a real, non-critical weakness and immediately explain how you are working to overcome it.',
    mistakes: 'Do not say "I am a perfectionist" (feels insincere) or list a major red flag like "I hate debugging".',
    sample: 'Sometimes I focus too much on micro-optimizing code early in a project. I have learned to prioritize building a functional MVP first, then refactoring and optimizing bottlenecks based on profiling metrics.'
  },
  {
    category: 'Conflict resolution',
    q: 'Describe a time you had a disagreement with a team member.',
    tips: 'Use the STAR method (Situation, Task, Action, Result). Focus on collaboration, empathy, and professional compromise.',
    mistakes: 'Do not blame or speak negatively about your teammate.',
    sample: 'During a hackathon, a teammate wanted to use SQL while I preferred NoSQL for rapid prototyping. Instead of arguing, we listed the schema complexity and timelines. We compromised by using PostgreSQL with JSONB columns, getting the best of both worlds.'
  },
  {
    category: 'Leadership',
    q: 'Tell me about a time you took the lead on a project.',
    tips: 'Show initiative, delegation, mentoring, and ownership of the outcomes.',
    mistakes: 'Do not take all the credit; highlight how you enabled others.',
    sample: 'When our team system migration stalled, I took the lead. I broke down the database schema transition into four incremental modules, assigned tasks based on team strengths, and set up daily standups. We migrated on time with zero downtime.'
  },
  {
    category: 'Teamwork',
    q: 'Describe a successful team collaboration.',
    tips: 'Highlight communication, division of responsibilities, and how team diversity drove the success.',
    mistakes: 'Using "I" exclusively. Emphasize "We" and "Our team".',
    sample: 'For our capstone project, we had to integrate frontend, backend, and machine learning models. We set clear REST API contracts on day one, pair programmed critical integration points, and successfully launched a high-quality product.'
  },
  {
    category: 'Failure stories',
    q: 'Tell me about a time you failed.',
    tips: 'Pick a genuine technical or process failure, take full responsibility, and focus on what you learned.',
    mistakes: 'Avoid saying "I\'ve never failed" or blaming external factors.',
    sample: 'In my first project, I pushed an unverified hotfix directly to production, which caused a database connection leak. I immediately rolled back, found the bug, and set up a staging pipeline. From that failure, I learned to never bypass CI/CD checks.'
  }
];

const SHEETS = [
  { id: 'blind75', name: 'Blind 75', total: 75, desc: 'The classic curated list of top LeetCode questions for coding interviews.', url: 'https://neetcode.io/practice' },
  { id: 'neetcode150', name: 'NeetCode 150', total: 150, desc: 'A comprehensive, structured extension of Blind 75 covering all major patterns.', url: 'https://neetcode.io/practice' },
  { id: 'striver', name: 'Striver SDE Sheet', total: 180, desc: 'Crucial interview sheet for top product companies in India and globally.', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/' }
];

const COMPANIES = [
  { name: 'Google', logo: '🌐', color: 'from-blue-500/20 to-red-500/20', border: 'hover:border-red-500/40' },
  { name: 'Amazon', logo: '📦', color: 'from-orange-500/20 to-yellow-600/20', border: 'hover:border-orange-500/40' },
  { name: 'Microsoft', logo: '💻', color: 'from-teal-500/20 to-blue-600/20', border: 'hover:border-teal-500/40' },
  { name: 'Meta', logo: '♾️', color: 'from-indigo-600/20 to-blue-500/20', border: 'hover:border-indigo-500/40' },
  { name: 'Adobe', logo: '📐', color: 'from-red-600/20 to-orange-500/20', border: 'hover:border-red-600/40' },
  { name: 'Uber', logo: '🚗', color: 'from-slate-700/20 to-slate-900/20', border: 'hover:border-slate-500/40' },
  { name: 'Atlassian', logo: '📘', color: 'from-blue-600/20 to-cyan-500/20', border: 'hover:border-blue-400/40' },
  { name: 'Walmart', logo: '☀️', color: 'from-yellow-500/20 to-blue-500/20', border: 'hover:border-yellow-500/40' },
  { name: 'Flipkart', logo: '🛒', color: 'from-blue-500/20 to-yellow-500/20', border: 'hover:border-blue-500/40' },
  { name: 'Goldman Sachs', logo: '💵', color: 'from-amber-600/20 to-green-600/20', border: 'hover:border-amber-500/40' }
];

const InterviewHub = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Experience modal fields
  const [showExpModal, setShowExpModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newQuestions, setNewQuestions] = useState('');
  const [newTips, setNewTips] = useState('');
  const [newDiff, setNewDiff] = useState('medium');
  const [newVerdict, setNewVerdict] = useState('Selected');

  // Behavioral accordion
  const [activeBehavioral, setActiveBehavioral] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tracksRes, expRes, progRes] = await Promise.all([
          axiosClient.get('/api/interview/tracks'),
          axiosClient.get('/api/interview/experiences'),
          axiosClient.get('/api/interview/progress')
        ]);
        setTracks(tracksRes.data.tracks || []);
        setExperiences(expRes.data.experiences || []);
        setProgress(progRes.data.progress || null);
      } catch (err) {
        console.error('Error fetching interview data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePostExperience = async (e) => {
    e.preventDefault();
    if (!newCompany || !newRole || !newQuestions) return;

    try {
      const questionsList = newQuestions.split('\n').filter(q => q.trim().length > 0);
      await axiosClient.post('/api/interview/experience', {
        company: newCompany,
        role: newRole,
        year: Number(newYear),
        questionsAsked: questionsList,
        tips: newTips,
        difficulty: newDiff,
        verdict: newVerdict
      });

      // Refresh experiences
      const expRes = await axiosClient.get('/api/interview/experiences');
      const progRes = await axiosClient.get('/api/interview/progress');
      setExperiences(expRes.data.experiences || []);
      setProgress(progRes.data.progress || null);
      
      // Reset fields
      setNewCompany('');
      setNewRole('');
      setNewQuestions('');
      setNewTips('');
      setShowExpModal(false);
    } catch (err) {
      console.error('Error creating experience:', err);
    }
  };

  const totalQuestions = tracks.reduce((sum, t) => sum + (t.totalQuestions || 0), 0);
  const totalSolved = progress?.solvedQuestions?.length || 0;
  const completionPercentage = totalQuestions ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d18] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Preparing Interview Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100 pb-20 pt-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ─── HERO SECTION ──────────────────────────────────────────────────────── */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f172a]/80 via-[#101426]/90 to-[#18122b]/80 border border-purple-500/20 p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_60%)]" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold rounded-full uppercase tracking-wider">
                <Shield size={13} /> Flagship Hub
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Crack Your Dream <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400">
                  Tech Interview
                </span>
              </h1>
              <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
                Master DSA, Operating Systems, DBMS, Networks, OOP, Behavioral frameworks, and practice interactive mock interviews with our AI Coach.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigate('/interview/mock-session')}
                  className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 hover:shadow-purple-700/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Play size={16} fill="white" /> Take Mock Interview
                </button>
                <button
                  onClick={() => navigate('/interview/resume')}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <FileText size={16} /> Resume Interview
                </button>
              </div>
            </div>

            {/* Hero Stats */}
            <div className="lg:col-span-5 bg-black/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-md">
              <h3 className="text-white font-bold text-lg border-b border-slate-800/80 pb-3">Your Progress Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <span className="text-slate-400 text-xs uppercase tracking-wider block font-semibold">Total Solved</span>
                  <span className="text-2xl font-black text-white mt-1 block">{totalSolved} <span className="text-xs text-slate-500 font-normal">/ {totalQuestions}</span></span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <span className="text-slate-400 text-xs uppercase tracking-wider block font-semibold">Mock Audits</span>
                  <span className="text-2xl font-black text-purple-400 mt-1 block">{progress?.mockInterviewCount || 0}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl col-span-2">
                  <span className="text-slate-400 text-xs uppercase tracking-wider block font-semibold mb-2">Overall Prep Completion</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
                    </div>
                    <span className="text-sm font-mono font-bold text-white">{completionPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PREPARATION TRACKS ────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Preparation Tracks</h2>
              <p className="text-slate-400 text-sm mt-0.5">Focus your preparation on individual subject areas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => {
              const TrackIcon = {
                dsa: Code2, os: Cpu, dbms: Database, cn: Globe, oop: Layers
              }[track.trackName] || BookOpen;

              const percent = track.totalQuestions ? Math.round((track.totalSolved / track.totalQuestions) * 100) : 0;

              return (
                <div
                  key={track.trackName}
                  onClick={() => navigate(`/interview/track/${track.trackName}`)}
                  className="bg-[#0f172a]/60 border border-slate-800/80 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-[#0f172a]/80 cursor-pointer transition-all flex flex-col justify-between group shadow-xl active:scale-[0.99] duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrackIcon size={24} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        track.difficulty.toLowerCase() === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        track.difficulty.toLowerCase() === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {track.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors capitalize">{track.trackName} Practice</h3>
                      <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-2">{track.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden pt-1">
                      {track.topics?.slice(0, 4).map(t => (
                        <span key={t.name} className="text-[10px] bg-slate-800 border border-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                          {t.name}
                        </span>
                      ))}
                      {track.topics?.length > 4 && (
                        <span className="text-[10px] text-slate-500 font-mono self-center">+{track.topics.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 mt-6 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Progress ({track.totalSolved}/{track.totalQuestions})</span>
                      <span className="font-bold text-white">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── COMPANY-WISE PREPARATION ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-white">Company-Wise Portals</h2>
            <p className="text-slate-400 text-sm mt-0.5">Explore interview experiences and questions asked at top companies</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COMPANIES.map((company) => (
              <button
                key={company.name}
                onClick={() => navigate(`/interview/company/${company.name}`)}
                className={`bg-[#0f172a]/40 border border-slate-800 hover:scale-[1.03] active:scale-[0.98] transition-all p-5 rounded-2xl text-left relative overflow-hidden group border-slate-800/80 ${company.border}`}
              >
                <div className={`absolute -right-4 -bottom-4 w-16 h-16 bg-gradient-to-br ${company.color} blur-xl rounded-full opacity-40 group-hover:scale-150 transition-transform duration-500`} />
                <span className="text-3xl mb-3 block">{company.logo}</span>
                <span className="text-white font-bold text-base block group-hover:text-purple-300 transition-colors">{company.name}</span>
                <span className="text-[11px] text-slate-500 font-medium block mt-1.5 flex items-center gap-1">
                  View Track <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ─── BEHAVIORAL QUESTIONS ─────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-white">Behavioral Interview Catalog</h2>
            <p className="text-slate-400 text-sm mt-0.5">Tackle behavioral rounds using sample answers and tips</p>
          </div>

          <div className="bg-[#0f172a]/60 border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
            {BEHAVIORAL_QUESTIONS.map((bq, i) => {
              const active = activeBehavioral === i;
              return (
                <div key={i} className="transition-colors">
                  <button
                    onClick={() => setActiveBehavioral(active ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left text-white hover:bg-slate-800/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="font-bold text-sm tracking-wide uppercase text-purple-400">{bq.category}</span>
                      <span className="hidden md:inline text-slate-400 text-sm">- {bq.q}</span>
                    </div>
                    <span className="text-xs text-slate-500">{active ? 'Hide Detail' : 'Show Detail'}</span>
                  </button>

                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-black/40 border-t border-slate-800/50 space-y-4 text-sm leading-relaxed">
                          <p className="text-white font-semibold">Q: {bq.q}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-1.5">
                              <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">Interview Tips & Framework</span>
                              <p className="text-slate-300 text-xs leading-relaxed">{bq.tips}</p>
                            </div>
                            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl space-y-1.5">
                              <span className="text-[10px] font-bold text-red-400 block uppercase tracking-wider">Common Mistakes to Avoid</span>
                              <p className="text-slate-300 text-xs leading-relaxed">{bq.mistakes}</p>
                            </div>
                          </div>
                          <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl space-y-1.5">
                            <span className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Sample STAR Answer</span>
                            <p className="text-slate-200 text-xs leading-relaxed font-mono">{bq.sample}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── CURATED SHEETS & SHARED EXPERIENCES ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Curated Sheets Progress */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">Curated Sheets</h2>
              <p className="text-slate-400 text-sm mt-0.5">Track structured problem-solving lists</p>
            </div>

            <div className="space-y-4">
              {SHEETS.map(sheet => (
                <a
                  key={sheet.id}
                  href={sheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#0f172a]/60 border border-slate-800/80 p-5 rounded-2xl space-y-4 hover:border-purple-500/50 hover:bg-[#0f172a]/80 transition-all duration-300 transform hover:-translate-y-0.5 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-white font-bold text-base group-hover:text-purple-400 transition-colors flex items-center gap-2">
                        {sheet.name}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{sheet.desc}</p>
                    </div>
                    <ExternalLink size={16} className="text-slate-500 group-hover:text-purple-400 transition-colors shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/40">
                    <span className="text-slate-400">Total: {sheet.total} Questions</span>
                    <span className="font-bold text-purple-400">0% Tracked</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Community Shared Experiences */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Interview Experiences</h2>
                <p className="text-slate-400 text-sm mt-0.5">Real interview feedback shared by community members</p>
              </div>
              <button
                onClick={() => setShowExpModal(true)}
                className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} /> Post Experience
              </button>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {experiences.length === 0 ? (
                <div className="bg-[#0f172a]/30 border border-slate-800/80 p-8 rounded-2xl text-center">
                  <MessageSquare className="text-slate-600 mx-auto mb-2" size={32} />
                  <p className="text-slate-500 text-sm italic">No experiences posted yet. Be the first to share!</p>
                </div>
              ) : (
                experiences.map(exp => (
                  <div key={exp._id} className="bg-[#0f172a]/60 border border-slate-800/80 p-5 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.userId?.avatar || `https://ui-avatars.com/api/?name=${exp.userId?.firstName}+${exp.userId?.lastName}&background=6366f1&color=fff&bold=true`}
                          alt="avatar"
                          className="w-9 h-9 rounded-full border border-slate-700"
                        />
                        <div>
                          <h4 className="text-white font-bold text-sm">{exp.userId?.firstName} {exp.userId?.lastName || ''}</h4>
                          <span className="text-slate-500 text-[11px] font-medium">{exp.role} at <span className="text-indigo-400 font-semibold">{exp.company}</span> ({exp.year})</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        exp.verdict === 'Selected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        exp.verdict === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {exp.verdict}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 uppercase tracking-widest text-[9px] font-bold block mb-1">Questions Asked</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {exp.questionsAsked?.map((q, idx) => <li key={idx}>{q}</li>)}
                        </ul>
                      </div>
                      {exp.tips && (
                        <div>
                          <span className="text-slate-500 uppercase tracking-widest text-[9px] font-bold block mb-1">Preparation Tips</span>
                          <p className="text-slate-300 italic">{exp.tips}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ─── SHARE EXPERIENCE MODAL ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showExpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowExpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-[#0f1929] border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5 overflow-y-auto max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Share2 className="text-purple-400" size={18} /> Share Your Interview Experience
                </h3>
                <button onClick={() => setShowExpModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handlePostExperience} className="space-y-4 text-sm text-slate-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase">Company Name</label>
                    <input
                      type="text"
                      value={newCompany}
                      onChange={e => setNewCompany(e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full bg-[#080d18] border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase">Role / Job Title</label>
                    <input
                      type="text"
                      value={newRole}
                      onChange={e => setNewRole(e.target.value)}
                      placeholder="e.g. Software Engineer Intern"
                      className="w-full bg-[#080d18] border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase">Year of Interview</label>
                    <input
                      type="number"
                      value={newYear}
                      onChange={e => setNewYear(e.target.value)}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase">Difficulty</label>
                    <select
                      value={newDiff}
                      onChange={e => setNewDiff(e.target.value)}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 outline-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase">Verdict</label>
                    <select
                      value={newVerdict}
                      onChange={e => setNewVerdict(e.target.value)}
                      className="w-full bg-[#080d18] border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-purple-500 outline-none"
                    >
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="No Offer">No Offer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase">Questions Asked (One per line)</label>
                  <textarea
                    rows={4}
                    value={newQuestions}
                    onChange={e => setNewQuestions(e.target.value)}
                    placeholder="e.g. Reverse a binary tree&#10;Describe dynamic memory allocation"
                    className="w-full bg-[#080d18] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-bold mb-1.5 uppercase">Preparation Tips</label>
                  <textarea
                    rows={3}
                    value={newTips}
                    onChange={e => setNewTips(e.target.value)}
                    placeholder="e.g. Practice graph traversals, review memory paging concepts."
                    className="w-full bg-[#080d18] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowExpModal(false)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all"
                  >
                    Post Experience
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewHub;
