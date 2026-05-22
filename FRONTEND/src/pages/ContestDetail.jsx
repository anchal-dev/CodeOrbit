import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../utils/axiosClient';
import { 
  Trophy, Clock, Play, List, Users, ShieldAlert, 
  Sparkles, ChevronRight, CheckCircle, XCircle, ArrowLeft, History 
} from 'lucide-react';
import { checkAuth } from '../authSlice';

/* ── helper: point valuation based on difficulty ── */
const getPoints = (diff) => {
  const d = (diff || '').toLowerCase();
  if (d === 'easy') return 100;
  if (d === 'medium') return 200;
  if (d === 'hard') return 300;
  return 100;
};

/* ── active countdown component ── */
const DetailTimer = ({ targetDate, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState({ hrs: '00', mins: '00', secs: '00', ended: false });

  useEffect(() => {
    if (!targetDate) return;
    const updateTimer = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        setTimeLeft({ hrs: '00', mins: '00', secs: '00', ended: true });
        if (onEnd) onEnd();
        return;
      }
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hrs: String(hrs).padStart(2, '0'),
        mins: String(mins).padStart(2, '0'),
        secs: String(secs).padStart(2, '0'),
        ended: false
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.ended) {
    return <span className="text-red-400 font-black tracking-wider text-xl uppercase">CONTEST ENDED</span>;
  }

  return (
    <div className="flex gap-2 items-center">
      {/* Hours */}
      <div className="flex flex-col items-center">
        <div className="bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-xl md:text-2xl font-black text-white font-mono leading-none">
          {timeLeft.hrs}
        </div>
        <span className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">Hrs</span>
      </div>
      <span className="text-xl font-bold text-slate-600">:</span>
      {/* Mins */}
      <div className="flex flex-col items-center">
        <div className="bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-xl md:text-2xl font-black text-white font-mono leading-none">
          {timeLeft.mins}
        </div>
        <span className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">Min</span>
      </div>
      <span className="text-xl font-bold text-slate-600">:</span>
      {/* Secs */}
      <div className="flex flex-col items-center">
        <div className="bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-xl md:text-2xl font-black text-white font-mono leading-none">
          {timeLeft.secs}
        </div>
        <span className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">Sec</span>
      </div>
    </div>
  );
};

const ContestDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState('problems'); // problems, leaderboard, submissions, rules
  const [localJoined, setLocalJoined] = useState(false);

  // Load participation state from localStorage
  useEffect(() => {
    const isJoined = localStorage.getItem(`contest_joined_${id}`);
    if (isJoined === 'true') {
      setLocalJoined(true);
    }
  }, [id]);

  const fetchContestData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/contest/${id}`);
      setContest(data);
      
      // Fetch leaderboard
      const lbRes = await axiosClient.get(`/contest/leaderboard/${id}`);
      setLeaderboard(Array.isArray(lbRes.data) ? lbRes.data : []);
    } catch (error) {
      console.error('Error fetching contest details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContestData();
  }, [id]);

  const handleJoin = async () => {
    if (!user) return alert("Please login first");
    try {
      setJoining(true);
      await axiosClient.post(`/contest/join/${id}`, { userId: user._id });
      
      // Save participation state in localStorage
      localStorage.setItem(`contest_joined_${id}`, 'true');
      setLocalJoined(true);
      
      await fetchContestData(); // Refresh details
      dispatch(checkAuth());
    } catch (error) {
      alert(error.response?.data?.message || 'Error joining contest');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0B1020]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <span className="loading loading-spinner loading-lg text-indigo-500"></span>
          <p className="text-sm">Configuring room details…</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-[#0B1020] text-slate-300 flex flex-col items-center justify-center gap-4">
        <Trophy size={48} className="text-slate-600" />
        <h2 className="text-2xl font-black text-white">Contest Room Not Found</h2>
        <NavLink to="/contests" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 text-sm">
          <ArrowLeft size={16} /> Return to Arena
        </NavLink>
      </div>
    );
  }

  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  const isUpcoming = now < start;
  const isEnded = now > end;
  const isActive = now >= start && now <= end;
  
  // Real or Local participation check
  const hasJoined = localJoined || (user && Array.isArray(contest.participants) && contest.participants.some(p => p.userId && (p.userId._id === user._id || p.userId === user._id)));

  // Problem letter mapping (A/B/C/D)
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Mock live submissions stream
  const mockSubmissions = [
    { user: "Alex Rivera", letter: "A", lang: "C++", status: "Accepted", time: "05 mins ago" },
    { user: "Sophia Chen", letter: "B", lang: "Python", status: "Accepted", time: "12 mins ago" },
    { user: "Liam Johnson", letter: "A", lang: "Java", status: "Wrong Answer", time: "18 mins ago" },
    { user: "Emma Smith", letter: "C", lang: "C++", status: "Runtime Error", time: "24 mins ago" },
    { user: "Alex Rivera", letter: "B", lang: "C++", status: "Accepted", time: "30 mins ago" }
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-300 pt-28 pb-20 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <NavLink to="/contests" className="text-slate-400 hover:text-white font-semibold flex items-center gap-1.5 text-xs">
            <ArrowLeft size={14} /> Back to Arena
          </NavLink>
        </div>

        {/* ══ HEADER CARD ══ */}
        <div className="relative bg-[#111827]/80 border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl shadow-2xl mb-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {isActive && (
                  <span className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-0.5 rounded-full text-xs font-black tracking-wider animate-pulse">
                    CONTEST ACTIVE
                  </span>
                )}
                {isUpcoming && (
                  <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-0.5 rounded-full text-xs font-black tracking-wider">
                    UPCOMING MATCH
                  </span>
                )}
                {isEnded && (
                  <span className="bg-slate-800 border border-slate-700 text-slate-400 px-3 py-0.5 rounded-full text-xs font-bold uppercase">
                    ENDED
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                  Weekly #1
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                {contest.title}
              </h1>
              <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
                {contest.description}
              </p>
            </div>

            {/* Action panel (Timer / Join) */}
            <div className="flex-none bg-[#0B1020]/80 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-3 min-w-[200px]">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                {isUpcoming ? 'Starts In' : isEnded ? 'Status' : 'Match Timer'}
              </p>
              
              <DetailTimer targetDate={isUpcoming ? contest.startTime : contest.endTime} onEnd={fetchContestData} />

              <div className="w-full mt-1">
                {isUpcoming ? (
                  <button className="w-full text-center py-2 text-xs font-bold bg-slate-800 border border-slate-700 text-slate-400 rounded-xl cursor-not-allowed">
                    Starts Soon…
                  </button>
                ) : hasJoined ? (
                  <div className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                    <CheckCircle size={13} /> Registered
                  </div>
                ) : (
                  <button 
                    disabled={joining || isEnded}
                    onClick={handleJoin}
                    className="w-full text-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-wider transition-all disabled:opacity-50 shadow-md shadow-indigo-600/15"
                  >
                    {joining ? 'Registering…' : 'Join Match'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ TABS NAVIGATION ══ */}
        <div className="flex bg-[#111827] p-1 rounded-2xl border border-white/10 w-fit mb-6 text-sm font-bold">
          {[
            { id: 'problems',    label: 'Problems',    icon: List },
            { id: 'leaderboard', label: 'Leaderboard',  icon: Trophy },
            { id: 'submissions', label: 'Submissions', icon: History },
            { id: 'rules',       label: 'Rules',        icon: ShieldAlert },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ══ TAB CONTENT PANEL ══ */}
        <div className="bg-[#111827]/85 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl min-h-[300px]">
          
          {/* PROBLEMS TAB */}
          {activeTab === 'problems' && (
            <div className="space-y-4">
              {!hasJoined && isActive ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <ShieldAlert size={40} className="text-amber-500 animate-bounce" />
                  <h3 className="text-white font-black text-base">Contest Lock Active</h3>
                  <p className="text-slate-400 text-xs max-w-sm">
                    You must register and join the contest to unlock and view the competition problems.
                  </p>
                  <button 
                    onClick={handleJoin}
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-indigo-600/15"
                  >
                    Join Contest Now
                  </button>
                </div>
              ) : isUpcoming ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <Clock size={40} className="text-indigo-400" />
                  <h3 className="text-white font-black text-base">Locked Arena</h3>
                  <p className="text-slate-400 text-xs max-w-sm">
                    Problems are securely encrypted and will be automatically unlocked when the match timer begins.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] text-slate-500 font-bold uppercase tracking-wider pb-3">
                        <th className="pb-3 pr-4 w-16 text-center">Code</th>
                        <th className="pb-3 pr-4">Problem</th>
                        <th className="pb-3 pr-4 w-28">Difficulty</th>
                        <th className="pb-3 pr-4 w-24">Max Points</th>
                        <th className="pb-3 text-right w-24">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {Array.isArray(contest.problems) && contest.problems.map((problem, idx) => {
                        const letter = letters[idx] || 'A';
                        const points = getPoints(problem.difficulty);
                        return (
                          <tr key={problem._id} className="hover:bg-white/5 transition-colors group">
                            <td className="py-4 pr-4 font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-center text-base">
                              {letter}
                            </td>
                            <td className="py-4 pr-4">
                              <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                                {problem.title}
                              </span>
                            </td>
                            <td className="py-4 pr-4">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                problem.difficulty?.toLowerCase() === 'easy'
                                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                  : problem.difficulty?.toLowerCase() === 'medium'
                                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                  : 'text-red-400 bg-red-500/10 border-red-500/20'
                              }`}>
                                {problem.difficulty || 'Medium'}
                              </span>
                            </td>
                            <td className="py-4 pr-4 font-mono font-bold text-indigo-300">
                              {points}
                            </td>
                            <td className="py-4 text-right">
                              <NavLink 
                                to={`/problem/${problem._id}`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 px-4 py-1.5 rounded-xl border border-indigo-500/25 transition-all"
                              >
                                Solve <ChevronRight size={12} />
                              </NavLink>
                            </td>
                          </tr>
                        );
                      })}
                      {(!Array.isArray(contest.problems) || contest.problems.length === 0) && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-slate-500">
                            No problems are configured for this match.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              {leaderboard.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <Trophy size={40} className="text-slate-600" />
                  <h3 className="text-white font-bold text-sm">Empty Leaderboard</h3>
                  <p className="text-slate-500 text-xs">No records available. Ranks will calculate live during match submissions.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] text-slate-500 font-bold uppercase tracking-wider pb-3">
                        <th className="pb-3 pr-4 w-16 text-center">Rank</th>
                        <th className="pb-3 pr-4">User</th>
                        <th className="pb-3 pr-4 w-28 text-center">Solved</th>
                        <th className="pb-3 pr-4 w-24 text-center">Score</th>
                        <th className="pb-3 text-right w-28">Penalty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leaderboard.map((item, index) => {
                        const rankColors = [
                          'text-amber-400 bg-amber-500/10 border-amber-500/30', // gold
                          'text-slate-300 bg-slate-300/10 border-slate-300/30', // silver
                          'text-orange-400 bg-orange-500/10 border-orange-500/30', // bronze
                        ];
                        const rCls = rankColors[index] || 'text-slate-500 bg-slate-800 border-slate-700/50';

                        return (
                          <tr key={index} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 pr-4 text-center">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black border ${rCls}`}>
                                {index + 1}
                              </span>
                            </td>
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full ring-2 ring-indigo-500/20 overflow-hidden bg-slate-800 shadow-md">
                                  <img 
                                    src={item.user?.avatar || `https://ui-avatars.com/api/?name=${item.user?.firstName || 'User'}&background=6366f1&color=fff&bold=true`}
                                    alt="Avatar" 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-white leading-tight">
                                    {item.user?.firstName} {item.user?.lastName}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                    @{item.user?.username || 'coder'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 pr-4 font-bold text-center text-emerald-400">
                              {item.problemsSolved || 0}
                            </td>
                            <td className="py-4 pr-4 font-mono font-black text-center text-indigo-300 text-base">
                              {item.score || 0}
                            </td>
                            <td className="py-4 text-right font-mono font-semibold text-slate-400">
                              {item.penalty || 0} min
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SUBMISSIONS TAB */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-2">
                <Sparkles size={13} className="text-indigo-400" />
                Live Submission Feed
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] text-slate-500 font-bold uppercase tracking-wider pb-3">
                      <th className="pb-3 pr-4">Coder</th>
                      <th className="pb-3 pr-4 w-24">Problem</th>
                      <th className="pb-3 pr-4 w-28">Language</th>
                      <th className="pb-3 pr-4 w-36">Status</th>
                      <th className="pb-3 text-right w-28">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {mockSubmissions.map((sub, i) => {
                      const isAcc = sub.status === 'Accepted';
                      const isErr = sub.status.includes('Error');
                      const sCls = isAcc 
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : isErr
                        ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                        : 'text-red-400 bg-red-500/10 border-red-500/20';

                      return (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 pr-4">
                            <span className="font-bold text-white">{sub.user}</span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-sm">
                              Problem {sub.letter}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                              {sub.lang}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${sCls}`}>
                              {isAcc ? <CheckCircle size={10} /> : <XCircle size={10} />}
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-4 text-right text-xs text-slate-500 font-semibold">
                            {sub.time}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RULES TAB */}
          {activeTab === 'rules' && (
            <div className="space-y-6 text-sm text-slate-300 max-w-3xl leading-relaxed">
              <div>
                <h3 className="text-white font-black text-base flex items-center gap-2 mb-2">
                  <ShieldAlert size={16} className="text-indigo-400" /> Contest Code of Conduct
                </h3>
                <p className="text-slate-400 text-xs">
                  To ensure a fair and competitive ecosystem, all participants must comply with our strict coding and submission guidelines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-[#0B1020]/65 border border-white/5 p-5 rounded-2xl space-y-2">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider text-indigo-300">Scoring & Penalties</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
                    <li>Easy problem grants <span className="text-indigo-300 font-bold">100 points</span>.</li>
                    <li>Medium problem grants <span className="text-indigo-300 font-bold">200 points</span>.</li>
                    <li>Hard problem grants <span className="text-indigo-300 font-bold">300 points</span>.</li>
                    <li>Each incorrect run penalty adds <span className="text-red-400 font-bold">+10 penalty minutes</span>.</li>
                  </ul>
                </div>

                <div className="bg-[#0B1020]/65 border border-white/5 p-5 rounded-2xl space-y-2">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider text-purple-300">Cheating & Plagiarism</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
                    <li>Multi-account usage is strictly prohibited.</li>
                    <li>Sharing solutions or code snippets will trigger instant DQ.</li>
                    <li>AI submission scanning runs on final testcase validations.</li>
                    <li>Ranks are final once review cycle ends.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/20 p-5 rounded-2xl">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} /> Orbit Coin Distribution
                </h4>
                <p className="text-xs text-slate-400">
                  Participating and completing at least 1 problem guarantees **+10 OrbitCoins**. Placing in the **Top 3** will unlock dynamic legendary chest badges in the Redeem Store and earn a flat **+100 OrbitCoins**!
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ContestDetail;
