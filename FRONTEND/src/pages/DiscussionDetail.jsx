import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  ThumbsUp, ThumbsDown, MessageSquare, Eye,
  Pin, Lock, ArrowLeft, CheckCircle, Tag
} from 'lucide-react';
import { io } from 'socket.io-client';
import axiosClient from '../utils/axiosClient';
import MarkdownViewer from '../components/MarkdownViewer';
import CommentThread from '../components/CommentThread';
import LoginRequiredModal from '../components/LoginRequiredModal';

const DiscussionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [post, setPost]       = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  /* ─── Socket.io ────────────────────────────────────── */
  useEffect(() => {
    setPost(null);
    setComments([]);
    setLoading(true);
    fetchPostDetails();

    const socket = io('https://codeorbit-backend-uwtg.onrender.com', { withCredentials: true });

    socket.on('connect', () => {
      socket.emit('join_room', `post_${id}`);
    });
    socket.on('new_comment',    () => fetchPostDetails());
    socket.on('vote_update',    () => fetchPostDetails());
    socket.on('answer_accepted',() => fetchPostDetails());

    return () => socket.close();
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      const { data } = await axiosClient.get(`/forum/post/${id}`);
      setPost(data.post);
      setComments(data.comments);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Actions ──────────────────────────────────────── */
  const handleReplyToPost = async (e) => {
    e.preventDefault();
    if (!user) { alert('Login required'); return; }
    if (!replyContent.trim()) return;
    setSubmitLoading(true);
    try {
      await axiosClient.post('/forum/comment', { postId: id, content: replyContent });
      setReplyContent('');
      setIsReplying(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Error posting reply');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReplyToComment = async (parentCommentId, content) => {
    if (!user) { alert('Login required'); return; }
    await axiosClient.post('/forum/comment', { postId: id, content, parentComment: parentCommentId });
  };

  const handleVote = async (targetId, targetModel, voteType) => {
    if (!user) { alert('Login required'); return; }
    try {
      await axiosClient.post('/forum/vote', { targetId, targetModel, voteType });
    } catch (err) {
      alert(err.response?.data?.error || 'Error voting');
    }
  };

  const handleAcceptAnswer = async (commentId) => {
    try {
      await axiosClient.post(`/forum/post/${id}/accept-answer`, { postId: id, commentId });
    } catch (err) {
      alert(err.response?.data?.error || 'Error accepting answer');
    }
  };

  /* ─── Loading ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <span className="loading loading-spinner text-indigo-500 loading-lg" />
      </div>
    );
  }
  if (!post) return null;

  /* ─── Render ───────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pt-32 md:pt-36 pb-16">
      <LoginRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="reply and vote in discussions"
      />
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/forum')}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors mb-4 md:mb-6 mt-2"
        >
          <ArrowLeft size={16} /> Back to Discussions
        </motion.button>

        {/* ── Main Post Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-[#1e293b]/60 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl"
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="flex flex-col md:flex-row">

            {/* ── Vote Sidebar ── */}
            <div className="flex flex-row md:flex-col items-center justify-center gap-3 bg-[#0f172a]/50 px-4 py-5 md:py-8 border-b md:border-b-0 md:border-r border-slate-700/50 shrink-0 md:w-[72px]">
              <button
                onClick={() => handleVote(post._id, 'DiscussionPost', 1)}
                className="p-2 rounded-xl hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400 transition-all duration-200"
              >
                <ThumbsUp size={20} />
              </button>
              <span className={`text-xl font-black ${post.votes > 0 ? 'text-emerald-400' : post.votes < 0 ? 'text-red-400' : 'text-slate-200'}`}>
                {post.votes}
              </span>
              <button
                onClick={() => handleVote(post._id, 'DiscussionPost', -1)}
                className="p-2 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all duration-200"
              >
                <ThumbsDown size={20} />
              </button>
            </div>

            {/* ── Post Body ── */}
            <div className="flex-1 min-w-0 p-6 md:p-8">

              {/* Status flags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.isPinned && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
                    <Pin size={10} /> Pinned
                  </span>
                )}
                {post.isLocked && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-red-500/10 border border-red-500/20 text-red-400 uppercase">
                    <Lock size={10} /> Locked
                  </span>
                )}
                {post.acceptedAnswer && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                    <CheckCircle size={10} /> Solved
                  </span>
                )}
                {post.linkedProblem && (
                  <button
                    onClick={() => navigate(`/problem/${post.linkedProblem._id}`)}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase hover:bg-blue-500/20 transition-colors"
                  >
                    Problem: {post.linkedProblem.title}
                  </button>
                )}
                {post.tags?.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-700/60 border border-slate-600/50 text-slate-400">
                    <Tag size={9} /> {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-black text-white mb-5 leading-tight tracking-tight">
                {post.title}
              </h1>

              {/* Author meta */}
              <div className="flex flex-wrap items-center gap-3 mb-7 pb-6 border-b border-slate-700/40">
                <img
                  src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.firstName}+${post.author?.lastName}&background=6366f1&color=fff&bold=true`}
                  alt="avatar"
                  className="w-9 h-9 rounded-full ring-2 ring-indigo-500/30"
                />
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    {post.author?.firstName} {post.author?.lastName}
                    <span className="ml-2 text-[10px] font-mono font-bold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">
                      Rep {post.author?.reputation ?? 0}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-5 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><Eye size={14} /> {post.views}</span>
                  <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {post.commentsCount}</span>
                </div>
              </div>

              {/* Content */}
              <div className="prose-sm text-slate-300 mb-8 leading-relaxed">
                <MarkdownViewer content={post.content} />
              </div>

              {/* Reply CTA */}
              {!post.isLocked && (
                <button
                  onClick={() => {
                    if (!user) { setShowAuthModal(true); return; }
                    setIsReplying(!isReplying);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 text-indigo-400 text-sm font-bold rounded-xl transition-all duration-200"
                >
                  <MessageSquare size={16} />
                  {isReplying ? 'Cancel Reply' : 'Add a Reply'}
                </button>
              )}
              {post.isLocked && (
                <div className="flex items-center gap-2 px-5 py-3 bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-bold rounded-xl">
                  <Lock size={14} /> This discussion is locked.
                </div>
              )}

              {/* Reply Editor */}
              <AnimatePresence>
                {isReplying && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleReplyToPost}
                    className="mt-5 p-5 bg-[#0f172a]/60 border border-slate-700/40 rounded-2xl space-y-4 overflow-hidden"
                  >
                    <textarea
                      className="w-full bg-[#0a0f1d] border border-slate-800 text-sm text-slate-300 placeholder-slate-500 rounded-xl p-4 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none min-h-[130px]"
                      placeholder="Write your response... (Markdown supported)"
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsReplying(false)}
                        className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitLoading || !replyContent.trim()}
                        className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                      >
                        {submitLoading ? <span className="loading loading-spinner loading-xs" /> : 'Post Reply'}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>

        {/* ── Comments Section ── */}
        <div>
          <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-400" />
            {post.commentsCount} {post.commentsCount === 1 ? 'Reply' : 'Replies'}
          </h2>

          {comments.length === 0 ? (
            <div className="bg-[#1e293b]/60 border border-slate-700/50 rounded-2xl p-12 text-center backdrop-blur-md">
              <MessageSquare size={36} className="mx-auto mb-3 text-slate-600" />
              <p className="text-slate-400 font-medium">No replies yet. Be the first to respond!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <CommentThread
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  postAuthorId={post.author?._id}
                  onReply={handleReplyToComment}
                  onAccept={handleAcceptAnswer}
                  onVote={handleVote}
                  onLoginRequired={() => setShowAuthModal(true)}
                  depth={0}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DiscussionDetail;
