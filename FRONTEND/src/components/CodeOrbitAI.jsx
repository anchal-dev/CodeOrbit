import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, X, Send, ChevronDown, Minus, Copy, CheckCircle,
  Lightbulb, Bug, Zap, FlaskConical, BookOpen, Sparkles,
  AlertTriangle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import axiosClient from '../utils/axiosClient';

// ─── Code block with copy button ─────────────────────────────────────────────
const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between bg-[#1a2235] px-4 py-2 border-b border-slate-700">
        <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
        >
          {copied
            ? <><CheckCircle size={13} className="text-emerald-400" /> Copied</>
            : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <pre className="bg-[#0d1117] p-4 overflow-x-auto text-[13px] leading-relaxed m-0 text-slate-200">
        <code>{value}</code>
      </pre>
    </div>
  );
};

// ─── Markdown renderer ────────────────────────────────────────────────────────
const MdRenderer = ({ content }) => (
  <div className="text-[14px] leading-[1.75] text-slate-100
    [&_p]:my-2 [&_p]:leading-relaxed
    [&_h1]:text-[15px] [&_h1]:font-bold [&_h1]:text-purple-300 [&_h1]:mt-5 [&_h1]:mb-2
    [&_h2]:text-[14px] [&_h2]:font-bold [&_h2]:text-purple-300 [&_h2]:mt-4 [&_h2]:mb-1.5
    [&_h3]:text-[14px] [&_h3]:font-semibold [&_h3]:text-indigo-300 [&_h3]:mt-3 [&_h3]:mb-1
    [&_ul]:my-2 [&_ul]:pl-5 [&_ul]:space-y-1
    [&_ol]:my-2 [&_ol]:pl-5 [&_ol]:space-y-1
    [&_li]:leading-relaxed [&_li]:text-slate-100
    [&_strong]:text-white [&_strong]:font-semibold
    [&_em]:text-slate-300
    [&_blockquote]:border-l-2 [&_blockquote]:border-purple-500 [&_blockquote]:bg-purple-500/5 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg [&_blockquote]:my-3
    [&_a]:text-indigo-400 [&_a]:underline">
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
          ) : (
            <code
              className="bg-slate-800 px-1.5 py-0.5 rounded text-purple-300 font-mono text-[12px] border border-slate-700"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre({ children }) { return <>{children}</>; }
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

// ─── Build rich problem context string (injected into every request) ──────────
const buildContext = (problem, code, language) => {
  if (!problem || !problem.title) return null;

  const examples = (problem.visibleTestCases || [])
    .map((tc, i) => `Example ${i + 1}:\n  Input: ${tc.input}\n  Output: ${tc.output}${tc.explanation ? `\n  Explanation: ${tc.explanation}` : ''}`)
    .join('\n');

  const constraints = (problem.constraints || []).join('\n');
  const tags = (problem.tags || []).join(', ');

  return {
    problemId:    problem._id || problem.id,
    problemTitle: problem.title,
    difficulty:   problem.difficulty,
    description:  problem.description || '',
    examples:     examples || 'No examples available.',
    constraints:  constraints || 'No constraints listed.',
    tags:         tags || 'General',
    code:         code || 'No code written yet.',
    language:     language || 'cpp',
  };
};

// ─── Quick actions (prompts are self-contained — no extra context needed) ─────
const QUICK_ACTIONS = [
  {
    label: 'Explain Problem',
    icon: BookOpen,
    getPrompt: () =>
      `Please explain this problem step by step:\n1. What exactly is the problem asking?\n2. What is the input format?\n3. What is the output format?\n4. What are the key observations or insights?\n5. What general approach would you suggest?`
  },
  {
    label: 'Give Hint',
    icon: Lightbulb,
    getPrompt: (hintCount) => {
      const hints = [
        `Give me Hint 1: A small observation about this problem that points me in the right direction. Do NOT reveal the solution.`,
        `Give me Hint 2: What algorithmic approach or pattern could I use? Still do not reveal the full solution.`,
        `Give me Hint 3: What data structure would be most useful here, and why?`,
        `Give me Hint 4: Give me a near-complete outline of the solution steps, but let me write the actual code.`,
      ];
      return hints[Math.min(hintCount, hints.length - 1)];
    }
  },
  {
    label: 'Debug Code',
    icon: Bug,
    getPrompt: () =>
      `Please analyze my current code carefully and identify:\n1. Any syntax errors\n2. Any logic errors or wrong assumptions\n3. Edge cases my code might not handle\n4. Any potential runtime errors (null, index out of bounds, overflow)\n5. Time/space complexity issues\n\nExplain what is wrong and how to fix it.`
  },
  {
    label: 'Complexity',
    icon: Zap,
    getPrompt: () =>
      `What is the optimal time and space complexity for this problem?\n1. Explain the brute force approach and its complexity.\n2. Explain the optimal approach and its complexity.\n3. Why is the optimal approach better?`
  },
  {
    label: 'Test Cases',
    icon: FlaskConical,
    getPrompt: () =>
      `Generate comprehensive test cases for this problem, including:\n1. Basic/normal cases\n2. Edge cases (empty input, single element, maximum values)\n3. Cases that might trip up common solutions\n4. Expected output for each case`
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const CodeOrbitAI = ({ problem, code, language }) => {
  const problemId  = problem?._id || problem?.id || 'unknown';
  const storageKey = `codeorbit-ai-v2-${problemId}`;

  const [isOpen,       setIsOpen]       = useState(false);
  const [isMinimized,  setIsMinimized]  = useState(false);
  const [panelHeight,  setPanelHeight]  = useState(700);
  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const [hintCount,    setHintCount]    = useState(0);  // tracks progressive hint level

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);
  const dragRef        = useRef({ dragging: false, startY: 0, startH: 0 });

  // ── Load per-problem history when problem changes ────────────────────────────
  useEffect(() => {
    if (!problem?._id && !problem?.id) return;
    try {
      const saved = localStorage.getItem(storageKey);
      setMessages(saved ? JSON.parse(saved) : []);
      // Count how many hints have been given for this problem
      if (saved) {
        const parsed = JSON.parse(saved);
        const hintMsgs = parsed.filter(m => m.role === 'assistant' && m._isHint);
        setHintCount(hintMsgs.length);
      } else {
        setHintCount(0);
      }
    } catch { setMessages([]); setHintCount(0); }
  }, [storageKey]);

  // ── Persist history per problem ──────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  // ── Auto scroll ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // ── Auto-grow textarea ───────────────────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // ── Drag-to-resize top edge ──────────────────────────────────────────────────
  const handleDragStart = useCallback((e) => {
    dragRef.current = { dragging: true, startY: e.clientY, startH: panelHeight };
    const onMove = (ev) => {
      if (!dragRef.current.dragging) return;
      const delta = dragRef.current.startY - ev.clientY;
      const newH  = Math.min(Math.max(dragRef.current.startH + delta, 420), window.innerHeight - 80);
      setPanelHeight(newH);
    };
    const onUp = () => {
      dragRef.current.dragging = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [panelHeight]);

  // ── Core send function ───────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text, { isHint = false } = {}) => {
    if (!text.trim() || isLoading) return;
    const userMsg = text.trim();
    setInput('');

    // Guard: reject if no problem context loaded
    if (!problem || !problem.title) {
      setMessages(prev => [...prev,
        { role: 'user',      content: userMsg },
        { role: 'assistant', content: '⚠️ **Unable to load problem context.** Please refresh the page and try again.' }
      ]);
      return;
    }

    const userMsgObj = { role: 'user', content: userMsg };
    setMessages(prev => [...prev, userMsgObj]);
    setIsLoading(true);

    try {
      const ctx = buildContext(problem, code, language);
      const response = await axiosClient.post('/api/ai/chat', {
        message: userMsg,
        history: messages,
        context: ctx,
      });

      const aiReply = response.data.reply || response.data.message || 'No response received.';
      const assistantMsg = { role: 'assistant', content: aiReply, _isHint: isHint };
      setMessages(prev => [...prev, assistantMsg]);

      if (isHint) setHintCount(c => c + 1);

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ **Connection error.** I could not reach the AI server. Please check your internet connection and try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, problem, code, language]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    setHintCount(0);
    localStorage.removeItem(storageKey);
  };

  // ── Difficulty badge color ───────────────────────────────────────────────────
  const difficultyColor = {
    easy:   'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    medium: 'text-orange-400  bg-orange-400/10  border-orange-400/30',
    hard:   'text-red-400    bg-red-400/10    border-red-400/30',
  }[problem?.difficulty?.toLowerCase()] || 'text-slate-400 bg-slate-400/10 border-slate-400/30';

  const hasContext = !!(problem && problem.title);

  return (
    <>
      {/* ── Floating trigger button ──────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 group"
          >
            <button
              onClick={() => { setIsOpen(true); setIsMinimized(false); }}
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600
                hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center
                shadow-2xl shadow-purple-700/40 hover:shadow-purple-600/60 hover:scale-110
                transition-all duration-200 ring-2 ring-purple-500/20 hover:ring-purple-500/50"
            >
              <Bot size={26} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#131b2f] animate-pulse" />
            </button>
            <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-[#1e293b] border border-slate-700
              text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
              transition-opacity pointer-events-none shadow-xl z-10">
              Ask CodeOrbit AI
              <div className="absolute top-full right-4 border-4 border-transparent border-t-[#1e293b]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Panel ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ height: isMinimized ? 'auto' : `${panelHeight}px` }}
            className="fixed bottom-6 right-6 z-50 flex flex-col
              w-[500px] xl:w-[550px]
              max-w-[calc(100vw-16px)] max-h-[calc(100vh-32px)]
              bg-[#0c1220] border border-purple-500/25
              rounded-2xl shadow-2xl shadow-black/60
              overflow-hidden"
          >
            {/* Drag handle */}
            {!isMinimized && (
              <div
                onMouseDown={handleDragStart}
                className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize
                  bg-transparent hover:bg-purple-500/25 transition-colors z-10 rounded-t-2xl"
              />
            )}

            {/* ── Header ───────────────────────────────────────────────────────── */}
            <div className="shrink-0 px-5 py-4 bg-[#111827] border-b border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111827]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">CodeOrbit AI</span>
                      <span className="text-[11px] text-emerald-400 font-medium">● Online</span>
                    </div>
                    {hasContext ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[12px] text-slate-300 font-medium truncate max-w-[200px]">
                          {problem.title}
                        </span>
                        {problem.difficulty && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor} shrink-0`}>
                            {problem.difficulty}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                        <AlertTriangle size={11} /> No problem loaded
                      </span>
                    )}
                  </div>
                </div>

                {/* Window controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={clearHistory}
                    title="Clear chat history"
                    className="px-2 h-7 flex items-center justify-center rounded-lg
                      text-[11px] text-slate-500 hover:text-slate-200 hover:bg-slate-700/60
                      transition-colors font-medium"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsMinimized(v => !v)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg
                      text-slate-500 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg
                      text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* ── Quick Actions ─────────────────────────────────────────────── */}
                <div className="shrink-0 px-4 py-2.5 border-b border-slate-800 bg-[#0e1623]">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                    {QUICK_ACTIONS.map(({ label, icon: Icon, getPrompt }) => (
                      <button
                        key={label}
                        onClick={() => {
                          const isHint = label === 'Give Hint';
                          const prompt = isHint ? getPrompt(hintCount) : getPrompt();
                          sendMessage(prompt, { isHint });
                        }}
                        disabled={isLoading || !hasContext}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                          bg-[#1a2235] hover:bg-purple-900/50
                          border border-slate-700 hover:border-purple-500/60
                          text-[12px] text-slate-300 hover:text-purple-200
                          font-medium transition-all duration-150
                          disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Icon size={13} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Messages ──────────────────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6
                  scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

                  {/* Empty state */}
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 space-y-5 py-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20
                        border border-purple-500/20 flex items-center justify-center">
                        <Sparkles size={28} className="text-purple-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-base font-bold text-white">
                          {hasContext ? `Ready for "${problem.title}"` : 'CodeOrbit AI'}
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {hasContext
                            ? 'I have full context about this problem and your code. Use the quick actions above or ask me anything.'
                            : 'Open a problem page to get started. I\'ll automatically pick up the problem context.'}
                        </p>
                      </div>
                      {hasContext && (
                        <div className="text-[11px] text-slate-600 bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2">
                          💡 Hint level resets when you clear history. Ask progressively for better hints.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message list */}
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600/40 to-purple-600/40
                          border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot size={16} className="text-purple-300" />
                        </div>
                      )}

                      <div className={`min-w-0 ${msg.role === 'user' ? 'max-w-[78%]' : 'max-w-[90%] flex-1'}`}>
                        {msg.role === 'user' ? (
                          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white
                            text-[14px] leading-relaxed px-4 py-3 rounded-2xl rounded-tr-sm
                            shadow-lg shadow-purple-900/30">
                            <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                          </div>
                        ) : (
                          <div className="bg-[#131f35] border border-slate-700/80 rounded-2xl rounded-tl-sm
                            px-5 py-4 shadow-md">
                            <MdRenderer content={msg.content} />
                          </div>
                        )}
                        <p className="text-[10px] text-slate-600 mt-1.5 px-1">
                          {msg.role === 'user' ? 'You' : 'CodeOrbit AI'}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Loading dots */}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600/40 to-purple-600/40
                        border border-purple-500/30 flex items-center justify-center shrink-0">
                        <Bot size={16} className="text-purple-300" />
                      </div>
                      <div className="bg-[#131f35] border border-slate-700/80 px-5 py-4 rounded-2xl rounded-tl-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                          <span className="text-[12px] text-slate-500 ml-1">Thinking…</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ── Input Area ────────────────────────────────────────────────── */}
                <div className="shrink-0 px-4 pb-4 pt-3 bg-[#0c1220] border-t border-slate-800">
                  {!hasContext && (
                    <div className="flex items-center gap-2 text-[12px] text-amber-400 bg-amber-400/5
                      border border-amber-400/20 rounded-lg px-3 py-2 mb-3">
                      <AlertTriangle size={13} />
                      Unable to load problem context. Please refresh the page.
                    </div>
                  )}
                  <div className="flex items-end gap-2 bg-[#131f35] border border-slate-700
                    focus-within:border-purple-500/70 rounded-xl transition-colors p-3">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={hasContext
                        ? `Ask about "${problem?.title}"… (Enter to send, Shift+Enter for newline)`
                        : 'Ask a coding question…'}
                      disabled={isLoading}
                      rows={1}
                      className="flex-1 bg-transparent text-[14px] text-slate-100 placeholder-slate-500
                        resize-none focus:outline-none leading-relaxed max-h-[120px] disabled:opacity-50"
                      style={{ minHeight: '24px' }}
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl
                        bg-gradient-to-br from-indigo-600 to-purple-600
                        hover:from-indigo-500 hover:to-purple-500
                        disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed
                        text-white transition-all duration-150 shadow-lg shadow-purple-900/30"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 text-center">
                    Full problem context + your code is sent with every message
                  </p>
                </div>
              </>
            )}

            {/* Minimized bar */}
            {isMinimized && (
              <div
                className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsMinimized(false)}
              >
                <Bot size={17} className="text-purple-400 shrink-0" />
                <span className="text-sm text-slate-200 font-semibold flex-1">CodeOrbit AI</span>
                {problem?.title && (
                  <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{problem.title}</span>
                )}
                <ChevronDown size={16} className="text-slate-500 rotate-180 shrink-0" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CodeOrbitAI;
