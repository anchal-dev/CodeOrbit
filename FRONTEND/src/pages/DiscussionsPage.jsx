import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Plus, TrendingUp, Clock, HelpCircle,
  CheckCircle, Search, Flame, Hash, Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axiosClient from '../utils/axiosClient';
import LoginRequiredModal from '../components/LoginRequiredModal';

const TAG_LIST = [
  'Array', 'Dynamic Programming', 'Graph', 'Tree', 'String',
  'Interview Experience', 'POTD', 'Doubt', 'Solution', 'Contest'
];

const FILTER_OPTIONS = [
  { key: 'newest',    label: 'Newest',     icon: Clock,       color: 'text-blue-400',    activeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  { key: 'trending',  label: 'Trending',   icon: TrendingUp,  color: 'text-orange-400',  activeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
  { key: 'unanswered',label: 'Unanswered', icon: HelpCircle,  color: 'text-purple-400',  activeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
  { key: 'solved',    label: 'Solved',     icon: CheckCircle, color: 'text-emerald-400', activeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
];

const DiscussionsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('newest');
  const [search, setSearch]     = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => { fetchPosts(); }, [filter, activeTag]);

  const fetchPosts = async () => {
    if (posts.length === 0) {
      setLoading(true);
    }
    try {
      const params = new URLSearchParams();
      if (filter)    params.append('filter', filter);
      if (activeTag) params.append('tag', activeTag);
      if (search)    params.append('search', search);
      const { data } = await axiosClient.get(`/forum/posts?${params.toString()}`);
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchPosts(); };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pt-32 md:pt-36 pb-16">
      <LoginRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="create and participate in discussions"
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#1e293b]/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-md"
        >
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-1">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <MessageSquare size={20} className="text-white" />
              </span>
              CodeOrbit Discuss
            </h1>
            <p className="text-slate-400 text-sm">Ask questions, share solutions, and explore interview experiences.</p>
          </div>
          <button
            onClick={() => {
              if (!user) { setShowAuthModal(true); return; }
              navigate('/forum/new');
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 whitespace-nowrap"
          >
            <Plus size={18} /> New Discussion
          </button>
        </motion.div>

        {/* ── Search Bar ── */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            className="w-full bg-[#1e293b]/60 border border-slate-700/50 text-slate-200 text-sm rounded-xl pl-11 pr-32 py-3 focus:outline-none focus:border-indigo-500 transition-colors backdrop-blur-md placeholder-slate-500"
            placeholder="Search discussions by title or content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Left Sidebar ── */}
          <div className="lg:col-span-1 space-y-5 order-2 lg:order-1">

            {/* Filters */}
            <div className="bg-[#1e293b]/60 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-md">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Filter size={12} /> Filters
              </h3>
              <div className="flex flex-col gap-1.5">
                {FILTER_OPTIONS.map(({ key, label, icon: Icon, activeBg }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      filter === key
                        ? activeBg
                        : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-[#1e293b]/60 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-md">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Hash size={12} /> Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTag('')}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                    activeTag === ''
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  All
                </button>
                {TAG_LIST.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                      activeTag === tag
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── Posts Feed ── */}
          <div className="lg:col-span-3 space-y-3 order-1 lg:order-2">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <span className="loading loading-spinner text-indigo-500 loading-lg" />
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-[#1e293b]/60 border border-slate-700/50 rounded-2xl p-14 text-center backdrop-blur-md">
                <MessageSquare size={40} className="mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400 font-medium">No discussions found matching your criteria.</p>
                <button
                  onClick={() => { setFilter('newest'); setActiveTag(''); setSearch(''); }}
                  className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {posts.map((post, i) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    onClick={() => navigate(`/forum/post/${post._id}`)}
                    className="group bg-[#1e293b]/60 border border-slate-700/50 rounded-xl p-5 hover:border-indigo-500/40 hover:bg-[#1e293b] transition-all duration-200 cursor-pointer backdrop-blur-md"
                  >
                    <div className="flex items-start gap-4">

                      {/* Vote box */}
                      <div className="flex flex-col items-center justify-center bg-[#0f172a]/80 border border-slate-700 rounded-xl px-3 py-2 min-w-[52px] shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">votes</span>
                        <span className={`text-lg font-black ${post.votes > 0 ? 'text-emerald-400' : post.votes < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                          {post.votes}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Badges row */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {post.acceptedAnswer && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                              ✓ Solved
                            </span>
                          )}
                          {post.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-sm font-bold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors line-clamp-1 leading-snug">
                          {post.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.firstName}+${post.author?.lastName}&background=6366f1&color=fff&bold=true`}
                              alt="avatar"
                              className="w-4 h-4 rounded-full"
                            />
                            <span className="text-slate-400 font-medium">
                              {post.author?.firstName} {post.author?.lastName}
                            </span>
                          </div>
                          <span>·</span>
                          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={11} /> {post.commentsCount} replies
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionsPage;
