import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Video, Activity, Users, FileCode, Bell, Trophy,
  TrendingUp, Sparkles, ArrowUpRight, BarChart2, CheckCircle2, AlertCircle, X, Calendar, Award
} from 'lucide-react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

function Admin() {
  const { user } = useSelector((state) => state.auth);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblems: 0,
    totalContests: 0,
    totalAnnouncements: 0,
    totalSubmissions: 0,
    activeUsersToday: 0,
    acceptedSubmissions: 0,
    submissionHistory: [],
    activeUsersHistory: []
  });

  // Announcement Form State
  const [announcement, setAnnouncement] = useState({ title: '', content: '' });
  const [announcing, setAnnouncing] = useState(false);

  // Contest Modal State
  const [isContestModalOpen, setIsContestModalOpen] = useState(false);
  const [allProblems, setAllProblems] = useState([]);
  const [contestForm, setContestForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 90,
    problems: [],
    coins: 100,
    badges: 'Top 3 Badge Rewards'
  });
  const [creatingContest, setCreatingContest] = useState(false);

  // Fetch admin stats & problems
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, problemsRes] = await Promise.all([
        axiosClient.get('/api/admin/stats'),
        axiosClient.get('/problem/getAllProblem').catch(() => ({ data: [] }))
      ]);
      
      setStats(statsRes.data);
      setAllProblems(problemsRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.message || 'Failed to load platform analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Broadcast announcement
  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.title || !announcement.content) return;
    if (announcement.content.length > 500) {
      alert('Announcement exceeds 500 characters limit');
      return;
    }
    try {
      setAnnouncing(true);
      await axiosClient.post('/announcement', {
        title: announcement.title,
        content: announcement.content,
        author: user._id
      });
      alert('Announcement broadcasted successfully!');
      setAnnouncement({ title: '', content: '' });
      // Refresh stats
      const statsRes = await axiosClient.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
      alert('Error posting announcement');
    } finally {
      setAnnouncing(false);
    }
  };

  // Create contest
  const handleCreateContest = async (e) => {
    e.preventDefault();
    const { title, description, startTime, endTime, duration, problems, coins, badges } = contestForm;
    if (!title || !description || !startTime || !endTime) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      setCreatingContest(true);
      await axiosClient.post('/api/contest', {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: Number(duration),
        problems,
        rewards: {
          coins: Number(coins),
          badges
        }
      });
      alert('Contest created successfully!');
      setIsContestModalOpen(false);
      // Reset form
      setContestForm({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        duration: 90,
        problems: [],
        coins: 100,
        badges: 'Top 3 Badge Rewards'
      });
      // Refresh stats
      const statsRes = await axiosClient.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error creating contest');
    } finally {
      setCreatingContest(false);
    }
  };

  const handleProblemToggle = (problemId) => {
    setContestForm(prev => {
      const isSelected = prev.problems.includes(problemId);
      const updatedProblems = isSelected 
        ? prev.problems.filter(id => id !== problemId)
        : [...prev.problems, problemId];
      return { ...prev, problems: updatedProblems };
    });
  };

  // Recharts Data Transformation
  const hasSubmissions = stats.totalSubmissions > 0;
  const acceptedPercentage = hasSubmissions 
    ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
    : 0;

  const pieData = [
    { name: 'Accepted', value: stats.acceptedSubmissions, color: '#10B981' },
    { name: 'Other Statuses', value: Math.max(stats.totalSubmissions - stats.acceptedSubmissions, 0), color: '#6366F1' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] text-slate-300 pt-28 px-6 pb-20 flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="h-24 bg-[#111827] border border-white/5 rounded-3xl" />
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-32 bg-[#111827] border border-white/5 rounded-3xl" />
            ))}
          </div>
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-[#111827] border border-white/5 rounded-3xl" />
            <div className="lg:col-span-1 h-96 bg-[#111827] border border-white/5 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1020] text-slate-300 pt-28 px-6 pb-20 flex flex-col justify-center items-center">
        <div className="bg-[#111827] border border-red-500/20 rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl">
          <AlertCircle size={48} className="text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Initialization Error</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{error}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-colors shadow-lg shadow-indigo-600/20"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, change: '↗ +8% this week', color: 'from-blue-500 to-indigo-600' },
    { label: 'Active Today', value: stats.activeUsersToday, icon: Activity, change: '↗ +24% live', color: 'from-emerald-500 to-teal-600' },
    { label: 'Total Problems', value: stats.totalProblems, icon: FileCode, change: '↗ +4 this month', color: 'from-orange-500 to-amber-600' },
    { label: 'Total Contests', value: stats.totalContests, icon: Trophy, change: '↗ +1 scheduled', color: 'from-purple-500 to-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-300 pt-28 px-6 pb-20 font-sans relative overflow-hidden">
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="relative bg-[#111827]/80 border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Activity size={18} className="text-white" />
              </span>
              CodeOrbit Admin Terminal
            </h1>
            <p className="text-slate-400 text-sm mt-1 ml-[52px]">Real-time analytics engine & database management panel.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-[#0B1020]/60 border border-white/5 px-4 py-2 rounded-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-300">SYSTEM SECURE</span>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx}
                className="relative bg-[#111827]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.08)] hover:-translate-y-1 transition-all duration-300 hover:border-indigo-500/20 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block tracking-wider uppercase">{card.label}</span>
                    <span className="text-3xl font-black text-white mt-1.5 block tracking-tight">{card.value}</span>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg shadow-indigo-500/10`}>
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <TrendingUp size={14} />
                  <span>{card.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Submissions Activity Chart */}
          <div className="lg:col-span-2 bg-[#111827]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 size={16} className="text-indigo-400" /> Platform Submission Activity
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Total & accepted submissions over the last 7 days.</p>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.submissionHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Area name="Total Submissions" type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                  <Area name="Accepted Runs" type="monotone" dataKey="accepted" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorAccepted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Submission Rate & Live Users */}
          <div className="lg:col-span-1 bg-[#111827]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award size={16} className="text-purple-400" /> Success Metrics
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Success rates for all run-times.</p>
            </div>

            <div className="flex items-center justify-center h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">{acceptedPercentage}%</span>
                <span className="text-[9px] text-slate-500 uppercase font-black">Acceptance</span>
              </div>
            </div>

            <div className="flex justify-around text-xs border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-400">Accepted: {stats.acceptedSubmissions}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="font-semibold text-slate-400">Other: {Math.max(stats.totalSubmissions - stats.acceptedSubmissions, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* OPERATIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Problem Management */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-black text-white px-1">Problem & Contest Operations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <NavLink 
                to="/admin/create" 
                className="group relative bg-[#111827]/85 border border-white/10 rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
              >
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Plus size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                    Create Problem <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Define markdown instructions & testcases.</p>
                </div>
              </NavLink>

              <NavLink 
                to="/admin/delete" 
                className="group relative bg-[#111827]/85 border border-white/10 rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]"
              >
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <Trash2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-1 group-hover:text-red-400 transition-colors">
                    Delete Problem <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Purge code challenges from platform list.</p>
                </div>
              </NavLink>

              <NavLink 
                to="/admin/video" 
                className="group relative bg-[#111827]/85 border border-white/10 rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
              >
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                  <Video size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
                    Video Solutions <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Upload, edit, and link visual editorials.</p>
                </div>
              </NavLink>

              <div 
                onClick={() => setIsContestModalOpen(true)}
                className="group relative bg-[#111827]/85 border border-white/10 rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
              >
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Trophy size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-1 group-hover:text-purple-400 transition-colors">
                    Create Contest <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Schedule new coding tournaments live.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Platform Announcements Column */}
          <div className="lg:col-span-1 bg-[#111827]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="text-lg font-black text-white flex items-center gap-2 mb-4">
              <Bell size={18} className="text-amber-400" /> Broadcast System Alert
            </h2>
            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alert Heading</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
                  placeholder="E.g. System upgrade"
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Details</label>
                  <span className={`text-[10px] font-bold ${announcement.content.length > 450 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                    {announcement.content.length} / 500
                  </span>
                </div>
                <textarea 
                  className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 h-28 resize-none" 
                  placeholder="Details regarding upcoming maintenance..."
                  value={announcement.content}
                  onChange={(e) => setAnnouncement({...announcement, content: e.target.value})}
                  maxLength={500}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-indigo-600/15 flex justify-center items-center gap-2 disabled:opacity-50"
                disabled={announcing}
              >
                {announcing ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span> Broadcasting...
                  </>
                ) : (
                  'Broadcast Alert'
                )}
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* CREATE CONTEST MODAL */}
      {isContestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111827] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600" />
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Trophy size={20} className="text-purple-400" /> Configure Contest Arena
              </h3>
              <button 
                onClick={() => setIsContestModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateContest} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contest Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
                    placeholder="Weekly Challenge #2"
                    value={contestForm.title}
                    onChange={(e) => setContestForm({...contestForm, title: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration (Minutes)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
                    placeholder="90"
                    value={contestForm.duration}
                    onChange={(e) => setContestForm({...contestForm, duration: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arena Details / Description</label>
                <textarea 
                  required
                  className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 h-20 resize-none" 
                  placeholder="Welcome participants..."
                  value={contestForm.description}
                  onChange={(e) => setContestForm({...contestForm, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={13} /> Start Date & Time
                  </label>
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer" 
                    value={contestForm.startTime}
                    onChange={(e) => setContestForm({...contestForm, startTime: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={13} /> End Date & Time
                  </label>
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer" 
                    value={contestForm.endTime}
                    onChange={(e) => setContestForm({...contestForm, endTime: e.target.value})}
                  />
                </div>
              </div>

              {/* Problem Selection Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode size={13} /> Select Contest Challenges (Select Up To 4)
                </label>
                <div className="bg-[#0B1020] border border-white/10 rounded-xl p-4 max-h-36 overflow-y-auto divide-y divide-white/5 space-y-1.5">
                  {allProblems.map(problem => {
                    const isChecked = contestForm.problems.includes(problem._id);
                    return (
                      <div 
                        key={problem._id} 
                        onClick={() => handleProblemToggle(problem._id)}
                        className="flex items-center gap-3 py-1.5 cursor-pointer group"
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {}} // toggled on container div click
                          className="checkbox checkbox-xs checkbox-primary border-slate-600"
                        />
                        <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                          {problem.title} 
                          <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                            problem.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10' :
                            problem.difficulty === 'medium' ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                  {allProblems.length === 0 && (
                    <div className="text-xs text-slate-500 py-2">No problems found. Please create coding problems first.</div>
                  )}
                </div>
              </div>

              {/* Rewards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reward Orbit Coins</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
                    placeholder="100"
                    value={contestForm.coins}
                    onChange={(e) => setContestForm({...contestForm, coins: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Badge Details</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
                    placeholder="Top 3 Badge Rewards"
                    value={contestForm.badges}
                    onChange={(e) => setContestForm({...contestForm, badges: e.target.value})}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsContestModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
                  disabled={creatingContest}
                >
                  {creatingContest ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span> Initializing...
                    </>
                  ) : (
                    'Deploy Contest'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;