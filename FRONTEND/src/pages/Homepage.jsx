import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { 
  Code2, Target, Award, PlayCircle, Cpu, Layers, BookOpen, 
  ArrowRight, Flame, Trophy, Star, TrendingUp, Compass, Zap, CheckCheck
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';

// Custom Animated Particles Component
const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen animate-pulse duration-7000 delay-1000"></div>
      <div className="absolute top-3/4 left-1/2 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-8000"></div>
      
      {/* Tiny CSS Stars */}
      {[...Array(50)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      ))}
    </div>
  );
};

// Glassmorphism Topic Card
const TopicCard = ({ title, desc, icon: Icon, color, problems, difficulty, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative group cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 blur-xl`}></div>
      <div className="relative h-full bg-[#1e293b]/40 backdrop-blur-xl border border-slate-700/50 hover:border-slate-500/50 rounded-2xl p-6 shadow-2xl transition-all duration-300 overflow-hidden">
        
        {/* Glow orb inside card */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500`}></div>

        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} p-[1px] mb-6 shadow-lg`}>
          <div className="w-full h-full bg-[#0f172a] rounded-xl flex items-center justify-center">
            <Icon className="text-white" size={24} />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6 h-10">{desc}</p>
        
        <div className="flex items-center justify-between mt-auto border-t border-slate-700/50 pt-4">
          <div>
            <p className="text-white font-bold text-lg">{problems}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Problems</p>
          </div>
          <span className="px-3 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-full text-xs font-semibold backdrop-blur-md">
            {difficulty}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Homepage = () => {
  const navigate = useNavigate();
  const [potd, setPotd] = useState(null);

  useEffect(() => {
    axiosClient.get('/potd').then(({ data }) => setPotd(data)).catch(() => {});
  }, []);

  // Mock Data
  const leaderBoard = [
    { rank: 1, name: 'AlexChen', points: 12450, solved: 842, avatar: 'https://ui-avatars.com/api/?name=Alex+C&background=6366f1&color=fff' },
    { rank: 2, name: 'SarahDev', points: 11200, solved: 756, avatar: 'https://ui-avatars.com/api/?name=Sarah+D&background=ec4899&color=fff' },
    { rank: 3, name: 'DavidCode', points: 10890, solved: 712, avatar: 'https://ui-avatars.com/api/?name=David+C&background=10b981&color=fff' },
    { rank: 4, name: 'ElenaPro', points: 9450, solved: 634, avatar: 'https://ui-avatars.com/api/?name=Elena+P&background=f59e0b&color=fff' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-8 backdrop-blur-md">
              <SparklesIcon size={16} /> Welcome to the Future of Coding
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
              Elevate Your <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                Engineering Craft
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              The premier platform for ambitious developers. Master algorithms, ace technical interviews, and climb the global leaderboard in a stunning, immersive environment.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavLink to="/signup" className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
                <button className="relative w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0a0f1c] text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-[1.02]">
                  <Flame size={20} className="text-orange-400"/> Start Learning Now
                </button>
              </NavLink>
              <NavLink to="/problems" className="w-full sm:w-auto btn btn-outline border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full px-8 py-4 h-auto text-lg font-semibold backdrop-blur-md">
                Explore Problems
              </NavLink>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 mx-auto max-w-4xl bg-[#1e293b]/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-wrap justify-between items-center gap-6"
        >
          <div className="text-center flex-1">
            <p className="text-3xl font-black text-white">2,450+</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Problems</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-slate-700/50"></div>
          <div className="text-center flex-1">
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">1.2M</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Developers</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-slate-700/50"></div>
          <div className="text-center flex-1">
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">50+</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Companies</p>
          </div>
        </motion.div>
      </section>

      {/* Topics & Tracks Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Master Every Structure</h2>
            <p className="text-slate-400 max-w-2xl">Curated roadmaps and problem sets designed to level up your algorithmic thinking.</p>
          </div>
          <NavLink to="/problems" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-4 md:mt-0 transition-colors">
            View All Topics <ArrowRight size={16}/>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TopicCard 
            title="Arrays" 
            desc="The foundation of data structures. Master sliding windows and pointers." 
            icon={Target} color="from-blue-500 to-cyan-500" 
            problems="342" difficulty="Easy - Hard" delay={0.1}
          />
          <TopicCard 
            title="Dynamic Prog." 
            desc="Optimize recursive solutions by storing overlapping subproblems." 
            icon={Cpu} color="from-purple-500 to-pink-500" 
            problems="156" difficulty="Medium - Hard" delay={0.2}
          />
          <TopicCard 
            title="Trees & Graphs" 
            desc="Navigate hierarchical data with DFS, BFS, and shortest path algorithms." 
            icon={Layers} color="from-emerald-500 to-teal-500" 
            problems="210" difficulty="Medium - Hard" delay={0.3}
          />
          <TopicCard 
            title="Strings" 
            desc="Text manipulation, pattern matching, and anagram algorithms." 
            icon={BookOpen} color="from-orange-500 to-amber-500" 
            problems="189" difficulty="Easy - Medium" delay={0.4}
          />
        </div>
      </section>

      {/* Middle Split Section: Daily Challenge & Leaderboard */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Daily Challenge (Takes up 2 cols on lg) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:opacity-75 transition-opacity opacity-50"></div>
            <div className="relative h-full bg-[#1e293b]/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col justify-center overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Flame size={120} />
              </div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-md text-xs font-bold w-max mb-6">
                <Flame size={14}/> DAILY CHALLENGE
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">
                {potd?.problem?.title || '...'}
              </h3>
              <p className="text-slate-400 mb-8 max-w-lg line-clamp-3">
                {potd?.problem?.description?.slice(0, 180) || 'Solve today\'s featured problem and earn +10 OrbitCoins.'}
              </p>
              
              <div className="flex items-center gap-6 mt-auto">
                {potd?.solvedToday ? (
                  <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
                    <CheckCheck className="text-emerald-400" size={18} />
                    <span className="text-emerald-400 font-bold">Solved Today!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => potd?.problem && navigate(`/problem/${potd.problem._id}`)}
                    disabled={!potd?.problem}
                    className="btn bg-white text-black hover:bg-slate-200 border-none px-8 rounded-full font-bold disabled:opacity-50"
                  >
                    Solve Now
                  </button>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  +10 OrbitCoins reward
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard (Takes up 1 col on lg) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="text-yellow-400" size={20}/> Top Coders
              </h3>
              <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-1 rounded">Global</span>
            </div>

            <div className="space-y-4">
              {leaderBoard.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-5 text-center ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {user.rank}
                    </span>
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-700 group-hover:border-indigo-400 transition-colors" />
                    <div>
                      <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.solved} solved</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-400">{user.points}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2 text-sm text-slate-400 hover:text-white bg-slate-800/30 hover:bg-slate-800 rounded-xl transition-colors font-medium">
              View Full Leaderboard
            </button>
          </motion.div>

        </div>
      </section>

      {/* Coding Tracks / Interview Prep */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10 border-t border-slate-800/50">
         <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Structured Learning Paths</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Follow guided curriculums tailored for specific goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Track 1 */}
          <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Beginner's Guide</h3>
            <p className="text-sm text-slate-400 mb-6">Start your journey here. Learn basic syntax, loops, and simple arrays.</p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '0%'}}></div>
            </div>
            <p className="text-xs text-slate-500 text-right">0 / 50 Completed</p>
          </div>

          {/* Track 2 */}
          <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-bl-lg">POPULAR</div>
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Interview Crash Course</h3>
            <p className="text-sm text-slate-400 mb-6">The ultimate 75 questions to crack FAANG interviews.</p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{width: '0%'}}></div>
            </div>
            <p className="text-xs text-slate-500 text-right">0 / 75 Completed</p>
          </div>

          {/* Track 3 */}
          <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/50 transition-all group">
            <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Advanced Algorithms</h3>
            <p className="text-sm text-slate-400 mb-6">Segment trees, advanced graph theory, and complex DP.</p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{width: '0%'}}></div>
            </div>
            <p className="text-xs text-slate-500 text-right">0 / 120 Completed</p>
          </div>
        </div>
      </section>

      {/* Global CSS for particle animations (since we can't easily edit tailwind config from here) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 10px 2px rgba(255,255,255,0.3); }
        }
        .animate-twinkle {
          animation: twinkle linear infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
      `}} />
    </div>
  );
};

// Helper icon
const SparklesIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);

export default Homepage;