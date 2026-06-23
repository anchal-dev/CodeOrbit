import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { 
  Code2, Target, Award, PlayCircle, Cpu, Layers, BookOpen, 
  ArrowRight, Flame, Trophy, Star, TrendingUp, Compass, Zap, CheckCheck,
  Terminal, Users, MessageSquare, Search, GitBranch, ArrowRightLeft
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';

// Custom Animated Particles Component (Reduced 80%)
const ParticleBackground = React.memo(() => {
  const particles = React.useMemo(() => {
    return [...Array(10)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.1,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Toned down glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-10000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-7000 delay-1000"></div>
      
      {/* Tiny CSS Stars */}
      {particles.map((p) => (
        <div 
          key={p.id} 
          className="absolute w-1.5 h-1.5 bg-slate-300 rounded-full animate-twinkle"
          style={{
            top: p.top,
            left: p.left,
            opacity: p.opacity,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration
          }}
        />
      ))}
    </div>
  );
});

// Feature Card
const FeatureCard = ({ title, desc, icon: Icon, delay, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={`bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all group duration-200 active:scale-[0.99] ${onClick ? 'cursor-pointer hover:border-indigo-500/50 hover:bg-[#0f172a]/80' : ''}`}
    >
      <div className="w-12 h-12 bg-slate-800/50 group-hover:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 transition-colors">
        <Icon className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
};

const Homepage = () => {
  const navigate = useNavigate();
  const [potd, setPotd] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  useEffect(() => {
    axiosClient.get('/potd').then(({ data }) => setPotd(data)).catch(() => {});
    
    // Fetch all problems for topics calculation
    axiosClient.get('/problem/getAllProblem')
      .then(({ data }) => {
        setProblems(data);
        setLoadingTopics(false);
      })
      .catch(() => setLoadingTopics(false));
  }, []);

  const dynamicTopics = React.useMemo(() => {
    if (!problems || problems.length === 0) return [];
    
    const groups = {};
    problems.forEach(p => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach(tag => {
          if (!groups[tag]) groups[tag] = { count: 0, difficulties: new Set() };
          groups[tag].count += 1;
          if (p.difficulty) groups[tag].difficulties.add(p.difficulty.toLowerCase());
        });
      }
    });

    const getDifficultyRange = (diffSet) => {
      if (diffSet.has('easy') && diffSet.has('hard')) return 'Easy → Hard';
      if (diffSet.has('easy') && diffSet.has('medium')) return 'Easy → Medium';
      if (diffSet.has('medium') && diffSet.has('hard')) return 'Medium → Hard';
      if (diffSet.has('easy')) return 'Easy';
      if (diffSet.has('medium')) return 'Medium';
      if (diffSet.has('hard')) return 'Hard';
      return 'Varied';
    };

    const iconMap = {
      'Array': { icon: Target, color: 'from-blue-500 to-cyan-500', desc: 'Master array manipulation and searching techniques.' },
      'Dynamic Programming': { icon: Cpu, color: 'from-purple-500 to-pink-500', desc: 'Solve optimization and state transition problems.' },
      'Tree': { icon: Layers, color: 'from-emerald-500 to-teal-500', desc: 'Learn traversals, shortest paths, and graph algorithms.' },
      'String': { icon: BookOpen, color: 'from-orange-500 to-amber-500', desc: 'Pattern matching and string manipulation.' },
      'Linked List': { icon: GitBranch, color: 'from-indigo-500 to-blue-500', desc: 'Understand pointers and data structure operations.' },
      'Binary Search': { icon: Search, color: 'from-red-500 to-orange-500', desc: 'Master searching in sorted spaces.' },
      'Greedy': { icon: Zap, color: 'from-yellow-400 to-amber-500', desc: 'Learn optimal local decision making.' },
      'Backtracking': { icon: ArrowRightLeft, color: 'from-rose-500 to-pink-600', desc: 'Explore recursive problem solving.' },
      'Math': { icon: Code2, color: 'from-indigo-400 to-purple-400', desc: 'Number theory and mathematical algorithms.' },
      'Sorting': { icon: Layers, color: 'from-teal-400 to-emerald-400', desc: 'Master efficient data organization.' }
    };

    const defaultIcon = { icon: Terminal, color: 'from-slate-500 to-slate-400', desc: 'Practice problems for this specific algorithmic topic.' };

    return Object.keys(groups)
      .map(tag => {
        const metadata = iconMap[tag] || iconMap[tag.replace(/s$/, '')] || defaultIcon;
        return {
          id: tag,
          title: tag,
          desc: metadata.desc,
          problems: groups[tag].count,
          difficulty: getDifficultyRange(groups[tag].difficulties),
          icon: metadata.icon,
          color: metadata.color
        };
      })
      .sort((a, b) => b.problems - a.problems); // Sort by most problems
  }, [problems]);

  // Mock Data
  const leaderBoard = [
    { rank: 1, name: 'AlexChen', points: 12450, solved: 842, avatar: 'https://ui-avatars.com/api/?name=Alex+C&background=6366f1&color=fff' },
    { rank: 2, name: 'SarahDev', points: 11200, solved: 756, avatar: 'https://ui-avatars.com/api/?name=Sarah+D&background=ec4899&color=fff' },
    { rank: 3, name: 'DavidCode', points: 10890, solved: 712, avatar: 'https://ui-avatars.com/api/?name=David+C&background=10b981&color=fff' },
    { rank: 4, name: 'ElenaPro', points: 9450, solved: 634, avatar: 'https://ui-avatars.com/api/?name=Elena+P&background=f59e0b&color=fff' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      <ParticleBackground />

      {/* Hero Section - Two Column SaaS Layout */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 max-w-7xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Copy & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-indigo-300 text-xs font-bold tracking-wide uppercase mb-6">
              <Code2 size={14} /> The Ultimate Coding Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-100 leading-[1.1] mb-6 tracking-tight">
              Master algorithms. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Ace the interview.
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
              Practice data structures, compete in live contests, and join a community of serious developers preparing for top tech roles.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <NavLink to="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98]">
                  Start Learning Free
                </button>
              </NavLink>
              <NavLink to="/problems" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-slate-300 px-8 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98]">
                  Explore Problems
                </button>
              </NavLink>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center gap-4 pt-8 border-t border-slate-800/50">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-[#020617]" src="https://ui-avatars.com/api/?name=A+A&background=6366f1&color=fff" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-[#020617]" src="https://ui-avatars.com/api/?name=B+B&background=10b981&color=fff" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-[#020617]" src="https://ui-avatars.com/api/?name=C+C&background=f59e0b&color=fff" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">1M+</div>
              </div>
              <div className="text-sm text-slate-400">
                <div className="flex items-center gap-1 text-yellow-500 mb-0.5">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                Trusted by developers worldwide
              </div>
            </div>
          </motion.div>

          {/* Right Column: CodeOrbit IDE Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative lg:h-[600px] w-full mt-12 lg:mt-0 perspective-1000"
          >
            {/* Background blur decorative block behind mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full transform -rotate-6 scale-95 opacity-50 z-0"></div>
            
            {/* Main IDE Window */}
            <div className="relative z-10 w-full h-[500px] bg-[#0a0f1c] rounded-2xl border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transform lg:-rotate-2 transition-transform hover:rotate-0 duration-500">
              
              {/* Window Header */}
              <div className="flex items-center px-4 py-3 bg-[#0f172a] border-b border-slate-800">
                <div className="flex gap-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 flex gap-2">
                  <div className="px-3 py-1 bg-[#1e293b] text-slate-300 text-xs font-medium rounded-t-md border-t border-l border-r border-slate-700/50">Two Sum.cpp</div>
                  <div className="px-3 py-1 text-slate-500 text-xs font-medium hover:text-slate-300 cursor-pointer">Description</div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded flex items-center gap-1"><PlayCircle size={12}/> Run</div>
                  <div className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded">Submit</div>
                </div>
              </div>

              {/* IDE Body */}
              <div className="flex-1 flex text-sm font-mono overflow-hidden">
                {/* Line numbers */}
                <div className="w-10 bg-[#0f172a]/50 text-slate-600 flex flex-col items-end pr-2 py-4 select-none text-xs border-r border-slate-800">
                  {Array.from({length: 15}).map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                
                {/* Code Area */}
                <div className="flex-1 p-4 text-slate-300 overflow-hidden relative">
                  <div><span className="text-pink-400">class</span> <span className="text-yellow-300">Solution</span> {'{'}</div>
                  <div className="pl-4"><span className="text-pink-400">public:</span></div>
                  <div className="pl-4"><span className="text-emerald-400">vector</span>{'<int>'} <span className="text-blue-400">twoSum</span>(<span className="text-emerald-400">vector</span>{'<int>&'} nums, <span className="text-pink-400">int</span> target) {'{'}</div>
                  <div className="pl-8"><span className="text-emerald-400">unordered_map</span>{'<int, int>'} map;</div>
                  <div className="pl-8"><span className="text-pink-400">for</span> (<span className="text-pink-400">int</span> i = <span className="text-orange-400">0</span>; i {'<'} nums.<span className="text-blue-400">size</span>(); i++) {'{'}</div>
                  <div className="pl-12"><span className="text-pink-400">int</span> complement = target - nums[i];</div>
                  <div className="pl-12"><span className="text-pink-400">if</span> (map.<span className="text-blue-400">count</span>(complement)) {'{'}</div>
                  <div className="pl-16"><span className="text-pink-400">return</span> {'{'}map[complement], i{'}'};</div>
                  <div className="pl-12">{'}'}</div>
                  <div className="pl-12">map[nums[i]] = i;</div>
                  <div className="pl-8">{'}'}</div>
                  <div className="pl-8"><span className="text-pink-400">return</span> {'{}'};</div>
                  <div className="pl-4">{'}'}</div>
                  <div>{'}'};</div>

                  {/* Blinking cursor */}
                  <div className="absolute top-[260px] left-[150px] w-2 h-4 bg-white/70 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Overlapping Floating Leaderboard Card */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-8 -right-8 w-64 bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700 shadow-[0_20px_40px_rgba(0,0,0,0.6)] rounded-xl p-4 z-20 hidden md:block"
            >
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                <Trophy size={16} className="text-yellow-500" />
                <span className="text-xs font-bold text-slate-200">Global Rank</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-[#020617]">#1</div>
                <div>
                  <div className="text-sm font-bold text-slate-100">You</div>
                  <div className="text-xs text-slate-400">2,450 Rating <span className="text-emerald-400 font-bold ml-1">↑ 12</span></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Master Every Topic - Horizontally Scrollable */}
      <section className="py-20 max-w-[100vw] overflow-hidden relative z-10 border-t border-slate-800/50 bg-[#0f172a]/20">
        <div className="px-6 max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Master Every Topic</h2>
            <p className="text-slate-400 max-w-2xl">Structured learning paths designed to take you from beginner to interview-ready.</p>
          </div>
          <NavLink to="/problems" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors whitespace-nowrap">
            View All Topics <ArrowRight size={16}/>
          </NavLink>
        </div>

        {/* Scrollable Container */}
        <div className="px-6 max-w-7xl mx-auto relative">
          {/* Edge gradients for smooth scroll fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none hidden md:block"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none hidden md:block"></div>
          
          <div className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {loadingTopics ? (
              // Skeleton Loader
              [...Array(6)].map((_, idx) => (
                <div key={idx} className="relative min-w-[300px] md:min-w-[340px] snap-start">
                   <div className="h-full bg-[#0f172a]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col animate-pulse">
                     <div className="w-12 h-12 rounded-xl bg-slate-800 mb-5"></div>
                     <div className="h-6 w-3/4 bg-slate-800 rounded mb-4"></div>
                     <div className="h-4 w-full bg-slate-800/50 rounded mb-2"></div>
                     <div className="h-4 w-5/6 bg-slate-800/50 rounded mb-8"></div>
                     <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-800/50">
                       <div>
                         <div className="h-6 w-10 bg-slate-800 rounded mb-1"></div>
                         <div className="h-3 w-16 bg-slate-800/50 rounded"></div>
                       </div>
                       <div className="h-6 w-20 bg-slate-800 rounded-full"></div>
                     </div>
                   </div>
                </div>
              ))
            ) : (
              dynamicTopics.map((topic, idx) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.1, 1.5) }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  onClick={() => navigate(`/problems?topic=${encodeURIComponent(topic.id)}`)}
                  className="relative min-w-[300px] md:min-w-[340px] snap-start group cursor-pointer"
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500 blur-xl`}></div>
                  
                  {/* Card Content */}
                  <div className="relative h-full bg-[#0f172a]/80 backdrop-blur-xl border border-slate-700/50 group-hover:border-slate-500/80 rounded-2xl p-6 shadow-xl transition-all duration-300 flex flex-col">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} p-[1px] mb-5 shadow-lg group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-shadow`}>
                      <div className="w-full h-full bg-[#0a0f1c] rounded-xl flex items-center justify-center">
                        <topic.icon className="text-white" size={24} />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-100 mb-2">{topic.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 flex-1">{topic.desc}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                      <div>
                        <p className="text-slate-100 font-bold">{topic.problems}</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Problems</p>
                      </div>
                      <span className="px-3 py-1 bg-[#0a0f1c] border border-slate-800 text-slate-300 rounded-full text-[10px] uppercase font-bold tracking-wider group-hover:bg-slate-800 transition-colors">
                        {topic.difficulty}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-slate-800/50">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Everything you need to excel</h2>
          <p className="text-slate-400">CodeOrbit provides a comprehensive suite of tools designed to help you prepare for technical interviews and competitive programming.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            title="Practice Problems" 
            desc="Access over 2,000+ algorithms ranging from Arrays to Advanced Graph Theory, categorized by difficulty and company tags." 
            icon={Target} delay={0.1}
            onClick={() => navigate('/problems')}
          />
          <FeatureCard 
            title="Live Contests" 
            desc="Compete in weekly and bi-weekly contests. Earn rating points, climb the global leaderboard, and showcase your skills." 
            icon={Award} delay={0.2}
            onClick={() => navigate('/contests')}
          />
          <FeatureCard 
            title="Interview Prep" 
            desc="Curated study plans tailored for top tech companies. Master patterns like Sliding Window, Two Pointers, and Dynamic Programming." 
            icon={Users} delay={0.3}
            onClick={() => navigate('/interview')}
          />
          <FeatureCard 
            title="Community Discussion" 
            desc="Engage with a community of developers. Share solutions, ask questions, and learn from detailed editorial explanations." 
            icon={MessageSquare} delay={0.4}
            onClick={() => navigate('/forum')}
          />
        </div>
      </section>

      {/* Middle Split Section: Daily Challenge & Leaderboard */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10 border-t border-slate-800/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Daily Challenge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 relative group"
          >
            <div className="absolute inset-0 bg-[#0f172a] rounded-3xl border border-slate-800 transition-colors group-hover:border-slate-700"></div>
            <div className="relative h-full p-8 md:p-10 flex flex-col justify-center overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Flame size={150} />
              </div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md text-xs font-bold w-max mb-6">
                <Flame size={14}/> DAILY CHALLENGE
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 z-10">
                {potd?.problem?.title || 'Daily Problem...'}
              </h3>
              <p className="text-slate-400 mb-8 max-w-lg line-clamp-3 z-10">
                {potd?.problem?.description?.slice(0, 180) || 'Solve today\'s featured problem to keep your streak alive and earn +10 OrbitCoins.'}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mt-auto z-10">
                {potd?.solvedToday ? (
                  <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <CheckCheck className="text-emerald-400" size={18} />
                    <span className="text-emerald-400 font-bold">Solved Today!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => potd?.problem && navigate(`/problem/${potd.problem._id}`)}
                    disabled={!potd?.problem}
                    className="flex items-center justify-center bg-slate-100 hover:bg-white text-slate-900 px-8 py-3 rounded-xl font-bold disabled:opacity-50 transition-colors"
                  >
                    Solve Now
                  </button>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  +10 OrbitCoins reward
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={18}/> Top Coders
              </h3>
              <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded">Global</span>
            </div>

            <div className="space-y-3 flex-1">
              {leaderBoard.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-5 text-center text-sm ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {user.rank}
                    </span>
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-slate-700" />
                    <div>
                      <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{user.solved} solved</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-400">{user.points}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 text-sm text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors font-semibold border border-slate-700/50 hover:border-slate-600">
              View Full Leaderboard
            </button>
          </motion.div>

        </div>
      </section>

      {/* Global CSS for particle animations and utilities */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 10px 2px rgba(255,255,255,0.3); }
        }
        .animate-twinkle {
          animation: twinkle linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

// Helper component
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