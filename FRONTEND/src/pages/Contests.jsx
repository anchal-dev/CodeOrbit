import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { 
  Trophy, Calendar, PlayCircle, History, Clock, MapPin, 
  GraduationCap, Star, Flame, Award, Users, ArrowRight, Sparkles 
} from 'lucide-react';

/* ── Live pulsing badge component ── */
const LiveBadge = () => (
  <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
    <span className="w-2 h-2 rounded-full bg-red-500 block animate-ping" />
    LIVE NOW
  </span>
);

/* ── Active countdown timer component ── */
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference <= 0) {
        setTimeLeft('CONTEST ENDED');
        return;
      }

      const hrs = Math.floor(difference / (1000 * 60 * 60));
      const mins = Math.floor((difference / 1000 / 60) % 60);
      const secs = Math.floor((difference / 1000) % 60);

      const fHrs = String(hrs).padStart(2, '0');
      const fMins = String(mins).padStart(2, '0');
      const fSecs = String(secs).padStart(2, '0');

      setTimeLeft(`${fHrs}:${fMins}:${fSecs}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="font-mono text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-indigo-400 tracking-wider">
      {timeLeft}
    </div>
  );
};

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, upcoming, live, past

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axiosClient.get('/contest');
        setContests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const getContestStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'past';
  };

  const filteredContests = contests.filter(contest => {
    if (activeTab === 'all') return true;
    const status = getContestStatus(contest.startTime, contest.endTime);
    return status === activeTab;
  });

  // Extract flagship contest (live Weekly Challenge or first live one)
  const flagshipContest = contests.find(c => c.slug === 'codeorbit-weekly-challenge-1') || contests.find(c => getContestStatus(c.startTime, c.endTime) === 'live') || contests[0];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0B1020]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <span className="loading loading-spinner loading-lg text-indigo-500"></span>
          <p className="text-sm">Loading arena…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-300 font-sans relative overflow-hidden pt-28 pb-20">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Hero Section */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Trophy size={18} className="text-white" />
            </span>
            CodeOrbit Arena
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-[52px]">Join competitive coding matches, win OrbitCoins, and claim your place in glory.</p>
        </div>

        {/* ══ FLAGSHIP CONTEST HERO SECTION ══ */}
        {flagshipContest && (
          <div className="mb-12">
            <div className="relative bg-[#111827]/85 border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl shadow-[0_0_50px_rgba(99,102,241,0.20)] hover:-translate-y-1 transition-all duration-300 group">
              {/* Pulsing card decoration */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Block */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <LiveBadge />
                    <span className="text-xs font-bold text-slate-400 uppercase bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                      Mixed Difficulty
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                      {flagshipContest.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-2xl">
                      {flagshipContest.description}
                    </p>
                  </div>

                  {/* Countdown Block */}
                  <div className="bg-[#0B1020]/75 border border-white/5 rounded-2xl p-4 inline-block min-w-[240px]">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Clock size={11} className="text-indigo-400" /> Ends In
                    </p>
                    <CountdownTimer targetDate={flagshipContest.endTime} />
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-y-4 gap-x-6 pt-2 text-xs text-slate-400 font-semibold border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-indigo-400" />
                      <span>{flagshipContest.duration || 90} Mins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-emerald-400" />
                      <span>4 Problems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-amber-400" />
                      <span>1,247 Registered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-purple-400" />
                      <span className="text-indigo-300">+100 Coins & Top Badges</span>
                    </div>
                  </div>
                </div>

                {/* Right Block */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
                  <div className="relative mb-6 hidden lg:block">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-600/20 border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden group-hover:rotate-3 transition-transform duration-300">
                      <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
                      <Trophy size={48} className="text-indigo-400 relative z-10 animate-bounce" />
                    </div>
                  </div>

                  <NavLink 
                    to={`/contest/${flagshipContest._id}`}
                    className="w-full lg:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all group-hover:scale-[1.02] duration-200"
                  >
                    Enter Contest Room <ArrowRight size={16} />
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ ALL CONTESTS SECTION ══ */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" /> All Coding Challenges
            </h3>
            
            {/* Filter Tabs */}
            <div className="bg-[#111827] p-1 rounded-xl border border-white/10 flex gap-1 text-xs">
              {[
                { id: 'all',      label: 'All' },
                { id: 'live',     label: 'Live' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'past',     label: 'Past' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredContests.length === 0 ? (
              <div className="col-span-full py-16 bg-[#111827] border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                <Trophy size={40} className="text-slate-600" />
                <div>
                  <h4 className="text-white font-bold text-sm">No challenges available</h4>
                  <p className="text-slate-500 text-xs mt-1">Check back later or view our seeded live matches.</p>
                </div>
              </div>
            ) : (
              filteredContests.map(contest => {
                const status = getContestStatus(contest.startTime, contest.endTime);
                const isPast = status === 'past';
                const isLive = status === 'live';

                return (
                  <div 
                    key={contest._id} 
                    className="relative bg-[#111827]/80 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden shadow-lg"
                  >
                    <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70" />
                    
                    <div className="space-y-4">
                      {/* Header row */}
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {contest.title}
                        </h4>
                        <div>
                          {isLive && (
                            <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide animate-pulse">
                              LIVE
                            </span>
                          )}
                          {status === 'upcoming' && (
                            <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide">
                              UPCOMING
                            </span>
                          )}
                          {isPast && (
                            <span className="bg-slate-800 border border-slate-700 text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              ENDED
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {contest.description}
                      </p>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-[11px] text-slate-400 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-indigo-400" />
                          <span>
                            {new Date(contest.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-indigo-400" />
                          <span>{contest.duration || 90} Mins</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-4">
                      <NavLink
                        to={`/contest/${contest._id}`}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold text-center block transition-all ${
                          isLive 
                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/15'
                            : isPast
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15'
                        }`}
                      >
                        {isPast ? 'View Leaderboard' : 'Enter Contest Room'}
                      </NavLink>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contests;
