import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, CheckCircle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axiosClient from '../utils/axiosClient';

const ProblemDiscussions = ({ problemId, problemTitle }) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/forum/posts?problemId=${problemId}`);
        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussions();
  }, [problemId]);

  return (
    <div className="pb-10 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquare size={16} className="text-indigo-400" />
          Discussions
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/forum', { state: { problemId } })}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-bold transition-colors"
          >
            View all <ArrowRight size={12} />
          </button>
          <button
            onClick={() => {
              if (!user) { alert('Please login first'); return; }
              navigate('/forum/new', { state: { problemId, problemTitle } });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-md shadow-indigo-600/20"
          >
            <Plus size={12} /> Ask Doubt
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner text-indigo-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-[#0f172a]/60 rounded-xl border border-slate-700/40">
          <MessageSquare size={28} className="mx-auto mb-3 text-slate-600" />
          <p className="text-slate-500 text-sm">No discussions for this problem yet.</p>
          <button
            onClick={() => {
              if (!user) { alert('Please login first'); return; }
              navigate('/forum/new', { state: { problemId, problemTitle } });
            }}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
          >
            Be the first to start one →
          </button>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-2.5">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                onClick={() => navigate(`/forum/post/${post._id}`)}
                className="group flex items-start gap-3 bg-[#0f172a]/70 border border-slate-700/40 rounded-xl p-4 hover:border-indigo-500/40 hover:bg-[#1e293b]/60 transition-all cursor-pointer"
              >
                {/* Vote box */}
                <div className="flex flex-col items-center justify-center bg-[#1e293b] border border-slate-700 rounded-lg px-2 py-1.5 min-w-[40px] shrink-0">
                  <span className={`text-sm font-black ${post.votes > 0 ? 'text-emerald-400' : post.votes < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {post.votes}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1.5">
                    {post.acceptedAnswer && (
                      <CheckCircle size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                    )}
                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors leading-snug line-clamp-1">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-500 font-medium">
                    <span className="text-slate-400">
                      {post.author?.firstName} {post.author?.lastName}
                    </span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={10} /> {post.commentsCount}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ProblemDiscussions;
