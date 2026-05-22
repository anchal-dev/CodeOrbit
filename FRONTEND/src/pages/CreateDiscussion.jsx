import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Tag, AlertCircle, Eye, Edit3 } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import MarkdownViewer from '../components/MarkdownViewer';

const TAG_SUGGESTIONS = [
  'Array', 'Dynamic Programming', 'Graph', 'Tree', 'String',
  'Doubt', 'Solution', 'Interview Experience', 'Contest', 'POTD'
];

const CreateDiscussion = () => {
  const { user }   = useSelector(state => state.auth);
  const navigate   = useNavigate();
  const location   = useLocation();

  const prefilledProblemId    = location.state?.problemId    || null;
  const prefilledProblemTitle = location.state?.problemTitle || null;

  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = (tag) => {
    const existing = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    if (!existing.includes(tag)) {
      setTagsInput(existing.length ? `${tagsInput.trim()}, ${tag}` : tag);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert('Please login to create a post'); return; }

    setIsSubmitting(true);
    try {
      const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const { data } = await axiosClient.post('/forum/post', {
        title,
        content,
        tags: tagsArray,
        linkedProblem: prefilledProblemId || undefined,
      });
      navigate(`/forum/post/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pt-32 md:pt-36 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/forum')}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors mb-4 md:mb-6 mt-2"
        >
          <ArrowLeft size={16} /> Back to Discussions
        </motion.button>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-[#1e293b]/60 border border-slate-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl overflow-hidden"
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <BookOpen size={17} className="text-white" />
            </span>
            Create New Discussion
          </h1>
          <p className="text-slate-400 text-sm mb-7 ml-12">
            Share your thoughts, ask questions, or provide solutions.
          </p>

          {/* Linked Problem Banner */}
          {prefilledProblemTitle && (
            <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
              <AlertCircle size={17} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-300 font-medium mb-0.5">Linked to problem:</p>
                <p className="text-sm font-bold text-blue-200">{prefilledProblemTitle}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── Title ── */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={200}
                placeholder="Keep it brief and descriptive..."
                className="w-full bg-[#0f172a] border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
              />
              <p className="text-[11px] text-slate-600 text-right">{title.length}/200</p>
            </div>

            {/* ── Tags ── */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Tag size={11} /> Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="e.g. Dynamic Programming, Graph (comma separated)"
                className="w-full bg-[#0f172a] border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
              />
              {/* Quick tag buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TAG_SUGGESTIONS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Markdown Editor ── */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Content <span className="text-red-400">*</span>
              </label>

              <div className="border border-slate-700 rounded-xl overflow-hidden bg-[#0f172a]">
                {/* Tab bar */}
                <div className="flex items-center gap-1 bg-[#1e293b]/80 border-b border-slate-700 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === 'write'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                  >
                    <Edit3 size={12} /> Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                  >
                    <Eye size={12} /> Preview
                  </button>
                  <span className="ml-auto text-[10px] text-slate-600">Markdown supported</span>
                </div>

                {activeTab === 'write' ? (
                  <textarea
                    required
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder={`Write your discussion here...\n\nMarkdown tips:\n**bold**, *italic*, \`inline code\`\n\`\`\`javascript\n// code block\n\`\`\``}
                    className="w-full h-72 bg-transparent p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none resize-y font-mono leading-relaxed"
                  />
                ) : (
                  <div className="h-72 p-4 overflow-y-auto">
                    {content ? (
                      <MarkdownViewer content={content} />
                    ) : (
                      <p className="text-slate-600 italic text-sm">Nothing to preview yet.</p>
                    )}
                  </div>
                )}

                <div className="bg-[#1e293b]/60 border-t border-slate-700 px-4 py-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600">Supports Markdown & code blocks</span>
                  <a
                    href="https://www.markdownguide.org/basic-syntax/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                  >
                    Formatting guide ↗
                  </a>
                </div>
              </div>
            </div>

            {/* ── Submit Row ── */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-700/40">
              <button
                type="button"
                onClick={() => navigate('/forum')}
                className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="px-6 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting
                  ? <><span className="loading loading-spinner loading-xs" /> Posting...</>
                  : 'Post Discussion'
                }
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateDiscussion;
