import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, ChevronDown, ChevronRight, Check } from 'lucide-react';
import MarkdownViewer from './MarkdownViewer';
import { useSelector } from 'react-redux';

const CommentThread = ({ comment, postId, postAuthorId, onReply, onAccept, onVote, depth = 0 }) => {
  const { user } = useSelector(state => state.auth);
  const [isReplying, setIsReplying]   = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    await onReply(comment._id, replyContent);
    setIsReplying(false);
    setReplyContent('');
  };

  const isOP = String(comment.author?._id) === String(postAuthorId);
  const isPostAuthor = user && String(user._id) === String(postAuthorId);

  return (
    <div className={`${depth > 0 ? 'ml-4 md:ml-8 pl-4 border-l border-slate-700/60' : ''} mt-3`}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
          comment.isAccepted
            ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
            : 'bg-[#1e293b]/60 border-slate-700/50'
        }`}
      >
        {/* Comment Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-700/40">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>

          <img
            src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${comment.author?.firstName}+${comment.author?.lastName}&background=6366f1&color=fff&bold=true`}
            alt="avatar"
            className="w-7 h-7 rounded-full shrink-0 ring-1 ring-slate-700"
          />

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 flex-1 min-w-0">
            <span className="text-sm font-bold text-slate-200">
              {comment.author?.firstName} {comment.author?.lastName}
            </span>
            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">
              Rep {comment.author?.reputation ?? 0}
            </span>
            {isOP && (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">OP</span>
            )}
            {comment.isAccepted && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                <CheckCircle size={10} /> Accepted
              </span>
            )}
            <span className="text-xs text-slate-500 ml-auto shrink-0">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Comment Body */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-4 text-sm text-slate-300 leading-relaxed">
                <MarkdownViewer content={comment.content} />
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex flex-wrap items-center gap-3">
                {/* Vote controls */}
                <div className="flex items-center bg-[#0f172a]/80 border border-slate-700/50 rounded-full overflow-hidden text-xs font-bold">
                  <button
                    onClick={() => onVote(comment._id, 'Comment', 1)}
                    className="px-3 py-1.5 hover:bg-slate-700/60 hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-1"
                  >
                    <ThumbsUp size={13} />
                  </button>
                  <span className="px-2 text-slate-200 border-x border-slate-700/50">{comment.votes}</span>
                  <button
                    onClick={() => onVote(comment._id, 'Comment', -1)}
                    className="px-3 py-1.5 hover:bg-slate-700/60 hover:text-red-400 text-slate-400 transition-colors flex items-center gap-1"
                  >
                    <ThumbsDown size={13} />
                  </button>
                </div>

                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <MessageSquare size={13} /> Reply
                </button>

                {isPostAuthor && !comment.parentComment && (
                  <button
                    onClick={() => onAccept(comment._id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      comment.isAccepted
                        ? 'text-emerald-400'
                        : 'text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    <Check size={13} />
                    {comment.isAccepted ? 'Unmark Accepted' : 'Mark as Answer'}
                  </button>
                )}
              </div>

              {/* Reply Input */}
              <AnimatePresence>
                {isReplying && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <form onSubmit={handleSubmitReply} className="p-4 space-y-3 bg-[#0f172a]/60 border-t border-slate-700/30">
                      <textarea
                        className="w-full bg-[#0a0f1d] border border-slate-700 text-sm text-slate-300 placeholder-slate-500 rounded-xl p-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none min-h-[80px]"
                        placeholder="Write a reply... (Markdown supported)"
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsReplying(false)}
                          className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                        >
                          Post Reply
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Nested Replies */}
      {!isCollapsed && comment.replies?.length > 0 && (
        <div>
          {comment.replies.map(reply => (
            <CommentThread
              key={reply._id}
              comment={reply}
              postId={postId}
              postAuthorId={postAuthorId}
              onReply={onReply}
              onAccept={onAccept}
              onVote={onVote}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
