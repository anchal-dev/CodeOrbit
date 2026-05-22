import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Clock, X, Code2, FileText, Cpu, MemoryStick } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

/* ── helpers ── */
const getStatusMeta = (status) => {
  switch ((status ?? '').toLowerCase()) {
    case 'accepted':
      return { label: 'Accepted', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', Icon: CheckCircle };
    case 'wrong':
    case 'wrong answer':
      return { label: 'Wrong Answer', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', Icon: XCircle };
    case 'error':
    case 'runtime error':
      return { label: 'Runtime Error', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', Icon: AlertTriangle };
    case 'pending':
      return { label: 'Pending', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', Icon: Clock };
    default:
      return { label: status ?? 'Unknown', color: 'text-slate-400', bg: 'bg-slate-700/40 border-slate-600/30', Icon: FileText };
  }
};

const formatMemory = (memory) => {
  const n = Number(memory);
  if (!memory || isNaN(n)) return '–';
  if (n < 1024) return `${n} kB`;
  return `${(n / 1024).toFixed(2)} MB`;
};

const formatRuntime = (runtime) => {
  if (runtime == null || runtime === '') return '–';
  return `${Number(runtime).toFixed(3)}s`;
};

const formatDate = (dateString) => {
  if (!dateString) return '–';
  try { return new Date(dateString).toLocaleString(); }
  catch { return '–'; }
};

/* ── component ── */
const SubmissionHistory = ({ problemId, refreshTrigger }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selected, setSelected]       = useState(null);

  useEffect(() => {
    if (!problemId) return;
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        // Safely handle: raw array OR { submissions: [...] } OR { data: [...] }
        const raw = res?.data;
        if (Array.isArray(raw)) {
          setSubmissions(raw);
        } else if (Array.isArray(raw?.submissions)) {
          setSubmissions(raw.submissions);
        } else if (Array.isArray(raw?.data)) {
          setSubmissions(raw.data);
        } else {
          setSubmissions([]);
        }
      } catch (err) {
        console.error('SubmissionHistory fetch error:', err);
        setError('Failed to load submission history. Please try again.');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId, refreshTrigger]);

  /* ── loading state ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
        <span className="loading loading-spinner loading-lg text-indigo-500" />
        <p className="text-sm">Loading submissions…</p>
      </div>
    );
  }

  /* ── error state ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <XCircle size={22} className="text-red-400" />
        </div>
        <p className="text-sm font-semibold text-red-400">{error}</p>
        <button
          onClick={() => setLoading(true) /* re-trigger via state reset */}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ── empty state ── */
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
          <Code2 size={24} className="text-slate-500" />
        </div>
        <div>
          <p className="text-slate-300 font-semibold mb-1">No submissions yet</p>
          <p className="text-slate-500 text-sm">Submit your solution to see your history here.</p>
        </div>
      </div>
    );
  }

  /* ── submission list ── */
  return (
    <>
      <div className="space-y-2.5">
        {submissions.map((sub, index) => {
          const meta = getStatusMeta(sub?.status);
          const StatusIcon = meta.Icon;
          return (
            <motion.div
              key={sub?._id ?? index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: index * 0.04 }}
              className="group flex flex-wrap md:flex-nowrap items-center gap-3 bg-[#1e293b]/60 border border-slate-700/50 rounded-xl px-4 py-3 hover:border-indigo-500/40 hover:bg-[#1e293b]/80 transition-all cursor-pointer"
              onClick={() => setSelected(sub)}
            >
              {/* Index */}
              <span className="text-xs font-mono text-slate-500 w-6 shrink-0">
                #{index + 1}
              </span>

              {/* Status badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color} shrink-0`}>
                <StatusIcon size={11} />
                {meta.label}
              </span>

              {/* Language */}
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded shrink-0">
                {sub?.language ?? '–'}
              </span>

              {/* Stats */}
              <div className="flex items-center gap-3 ml-auto text-xs text-slate-500 flex-wrap justify-end">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {formatRuntime(sub?.runtime)}
                </span>
                <span className="flex items-center gap-1">
                  <Cpu size={11} /> {formatMemory(sub?.memory)}
                </span>
                {(sub?.testCasesPassed != null && sub?.testCasesTotal != null) && (
                  <span className="flex items-center gap-1">
                    <CheckCircle size={11} />
                    {sub.testCasesPassed}/{sub.testCasesTotal} cases
                  </span>
                )}
                <span className="hidden sm:block">{formatDate(sub?.createdAt)}</span>
              </div>

              {/* View code button */}
              <button
                onClick={(e) => { e.stopPropagation(); setSelected(sub); }}
                className="shrink-0 text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-700 text-slate-400 hover:border-indigo-500/40 hover:text-indigo-400 transition-colors"
              >
                View Code
              </button>
            </motion.div>
          );
        })}

        <p className="text-xs text-slate-600 text-right pt-1">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Code Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[#0f172a] border border-slate-700/60 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white">Submission Details</h3>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusMeta(selected?.status).bg} ${getStatusMeta(selected?.status).color}`}>
                    {getStatusMeta(selected?.status).label}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                    {selected?.language ?? '–'}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-3 px-6 py-3 border-b border-slate-700/40 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Clock size={12} /> Runtime: {formatRuntime(selected?.runtime)}</span>
                <span className="flex items-center gap-1.5"><Cpu size={12} /> Memory: {formatMemory(selected?.memory)}</span>
                {(selected?.testCasesPassed != null && selected?.testCasesTotal != null) && (
                  <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Cases: {selected.testCasesPassed}/{selected.testCasesTotal}</span>
                )}
                <span className="ml-auto">{formatDate(selected?.createdAt)}</span>
              </div>

              {/* Error message if any */}
              {selected?.errorMessage && (
                <div className="mx-6 mt-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-xs text-red-300 font-mono">
                  {selected.errorMessage}
                </div>
              )}

              {/* Code block */}
              <div className="overflow-y-auto max-h-[50vh] m-4 rounded-xl border border-slate-700/50">
                <pre className="p-4 bg-[#020817] text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
                  <code>{selected?.code ?? '// No code available'}</code>
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SubmissionHistory;