import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { NavLink, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Editor from '@monaco-editor/react';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ProblemDiscussions from '../components/ProblemDiscussions';
import ChatAi from '../components/ChatAi';
import { checkAuth } from '../authSlice';
import { 
  ArrowLeft, ArrowDown, BookOpen, FileText, History, Code2, 
  Play, Send, RotateCcw, Maximize2, Copy, CheckSquare, Terminal,
  CheckCircle, ChevronDown, MessageSquare
} from 'lucide-react';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  python: 'Python',
  c: 'C',
  javascript: 'JavaScript'
};

const monacoLangMap = {
  cpp: 'cpp',
  java: 'java',
  python: 'python',
  c: 'c',
  javascript: 'javascript'
};

const ProblemPage = () => {
  const dispatch = useDispatch();
  const [submissionCounter, setSubmissionCounter] = useState(0);
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [consoleTab, setConsoleTab] = useState('testcase'); // testcase or result
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [solutionLanguage, setSolutionLanguage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const editorRef = useRef(null);
  const leftPaneRef = useRef(null);
  let {problemId}  = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.starterCode?.find(
          sc => sc.language.toLowerCase() === selectedLanguage || sc.language === langMap[selectedLanguage]
        )?.initialCode || '';

        setProblem(response.data);
        setCode(initialCode);
        
        if (response.data.referenceSolution && response.data.referenceSolution.length > 0) {
          setSolutionLanguage(response.data.referenceSolution[0].language);
        } else {
          setSolutionLanguage('');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => { editorRef.current = editor; };

  const handleReset = () => {
    if (problem) {
      const initialCode = problem.starterCode?.find(
        sc => sc.language.toLowerCase() === selectedLanguage || sc.language === langMap[selectedLanguage]
      )?.initialCode || '';
      setCode(initialCode);
    }
  };

  const handleRun = async () => {
    setIsSubmitting(true);
    setRunResult(null);
    setConsoleTab('result');
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setRunResult(response.data);
    } catch (error) {
      // Handle quota errors (429) cleanly
      const data = error.response?.data;
      if (error.response?.status === 429 || data?.type === 'JUDGE_QUOTA_EXCEEDED') {
        setRunResult({
          verdict: 'quota_exceeded',
          success: false,
          error: data?.message || 'Submission limit reached temporarily. Please try again later.',
          testCases: []
        });
      } else {
        const errMsg = data?.error || data?.message || data || error.message || 'Internal server error';
        setRunResult({ verdict: 'error', success: false, error: String(errMsg), testCases: [] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    setRunResult(null);
    setConsoleTab('result');
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setSubmitResult(response.data);
      setSubmissionCounter(prev => prev + 1);
      dispatch(checkAuth());
    } catch (error) {
      const data = error.response?.data;
      if (error.response?.status === 429 || data?.type === 'JUDGE_QUOTA_EXCEEDED') {
        setSubmitResult({
          accepted: false,
          status: 'quota_exceeded',
          error: data?.message || 'Submission limit reached temporarily. Please try again later.',
          passedTestCases: 0, totalTestCases: 0
        });
      } else {
        const errMsg = data?.error || data?.message || data || error.message || 'Internal server error';
        setSubmitResult({ accepted: false, status: 'error', error: String(errMsg), passedTestCases: 0, totalTestCases: 0 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = (codeToCopy) => {
    navigator.clipboard.writeText(codeToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const scrollToBottom = () => {
    if (leftPaneRef.current) {
      leftPaneRef.current.scrollTo({
        top: leftPaneRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const getDifficultyStyles = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#131b2f]">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  const activeSolution = problem?.referenceSolution?.find(s => s.language === solutionLanguage);

  return (
    <div className="h-screen pt-20 flex bg-[#131b2f] text-slate-300 font-sans overflow-hidden">
      
      {/* Left Panel */}
      <div className="w-[45%] flex flex-col border-r border-slate-800/60 bg-[#151c2c]">
        
        {/* Left Header Info */}
        <div className="p-5 border-b border-slate-800/60 shrink-0">
          <NavLink to="/problems" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1.5" /> Back to Problems
          </NavLink>
          
          <h1 className="text-2xl font-bold text-white mb-3 tracking-wide">{problem?.title}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyStyles(problem?.difficulty)}`}>
              {problem?.difficulty?.charAt(0).toUpperCase() + problem?.difficulty?.slice(1)}
            </span>
            {problem?.acceptanceRate && (
              <span className="text-sm font-medium text-slate-400">
                Acceptance: {problem.acceptanceRate}%
              </span>
            )}
          </div>
          
          <button 
            onClick={scrollToBottom}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-medium text-slate-300 transition-colors"
          >
            <ArrowDown size={14} /> Go to Bottom
          </button>
        </div>

        {/* Left Tabs */}
        <div className="flex bg-[#1a2335] border-b border-slate-800/60 px-2 shrink-0">
          <button 
            className={`flex items-center px-5 py-3 text-[13px] font-bold border-b-2 transition-colors ${activeLeftTab === 'description' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            onClick={() => setActiveLeftTab('description')}
          >
            <BookOpen size={16} className="mr-2" /> Description
          </button>
          <button 
            className={`flex items-center px-5 py-3 text-[13px] font-bold border-b-2 transition-colors ${activeLeftTab === 'editorial' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            onClick={() => setActiveLeftTab('editorial')}
          >
            <FileText size={16} className="mr-2" /> Editorial
          </button>
          <button 
            className={`flex items-center px-5 py-3 text-[13px] font-bold border-b-2 transition-colors ${activeLeftTab === 'submissions' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            onClick={() => setActiveLeftTab('submissions')}
          >
            <History size={16} className="mr-2" /> Submissions
          </button>
          <button 
            className={`flex items-center px-5 py-3 text-[13px] font-bold border-b-2 transition-colors ${activeLeftTab === 'solutions' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            onClick={() => setActiveLeftTab('solutions')}
          >
            <Code2 size={16} className="mr-2" /> Solutions
          </button>
          <button 
            className={`flex items-center px-5 py-3 text-[13px] font-bold border-b-2 transition-colors ${activeLeftTab === 'discussions' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            onClick={() => setActiveLeftTab('discussions')}
          >
            <MessageSquare size={16} className="mr-2" /> Discuss
          </button>
        </div>

        {/* Left Content Scrollable Area */}
        <div ref={leftPaneRef} className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {problem && (
            <>
              {/* Description Tab */}
              {activeLeftTab === 'description' && (
                <div className="space-y-8 pb-10">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white tracking-wide">Problem Description</h3>
                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-300">
                      {problem.description}
                    </div>
                  </div>

                  {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white tracking-wide">Examples</h3>
                      {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className="bg-[#243046]/50 border border-slate-700/50 p-4 rounded-xl">
                          <p className="font-bold text-white mb-2">Example {index + 1}:</p>
                          <div className="font-mono text-[13px] space-y-2 text-slate-300 leading-relaxed">
                            <div><span className="font-semibold text-slate-100">Input:</span> {example.input}</div>
                            <div><span className="font-semibold text-slate-100">Output:</span> {example.output}</div>
                            {example.explanation && (
                              <div><span className="font-semibold text-slate-100">Explanation:</span> {example.explanation}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Real constraints from DB */}
                  {problem.constraints && problem.constraints.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white tracking-wide">Constraints</h3>
                      <div className="bg-[#243046]/50 border border-slate-700/50 p-4 rounded-xl font-mono text-[13px] text-slate-300 space-y-1">
                        {problem.constraints.map((c, i) => (
                          <p key={i}>{c}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {problem.tags && problem.tags.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white tracking-wide">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map(tag => (
                          <span key={tag} className="px-3 py-1.5 rounded-full text-[11px] font-bold text-blue-400 bg-[#1e293b] border border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {problem.companies && problem.companies.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white tracking-wide">Companies</h3>
                      <div className="flex flex-wrap gap-2">
                        {problem.companies.map(company => (
                          <span key={company} className="px-3 py-1.5 rounded-full text-[11px] font-bold text-purple-400 bg-[#1e293b] border border-purple-500/30">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Editorial Tab */}
              {activeLeftTab === 'editorial' && (
                <div className="space-y-8 pb-10">
                  <h2 className="text-xl font-bold text-white">Editorial</h2>
                  
                  <div className="bg-[#243046]/30 border border-slate-700/50 p-6 rounded-xl">
                    <div className="prose prose-invert max-w-none prose-h3:text-blue-400 prose-h3:mt-6 prose-h3:mb-2 prose-p:leading-relaxed text-[15px] text-slate-300 font-medium">
                      <ReactMarkdown>{problem.editorial || 'No editorial provided for this problem.'}</ReactMarkdown>
                    </div>
                  </div>

                  {problem.videoId && (
                    <div className="space-y-4 mt-8">
                      <h3 className="text-lg font-bold text-white">Video Editorial</h3>
                      <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-black">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${problem.videoId}`} 
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen>
                        </iframe>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Solutions Tab */}
              {activeLeftTab === 'solutions' && (
                <div className="space-y-8 pb-10">
                  <h2 className="text-xl font-bold text-white">Official Solutions</h2>
                  
                  {problem.referenceSolution && problem.referenceSolution.length > 0 ? (
                    <div className="space-y-6">
                      {/* Language Toggles */}
                      <div className="flex flex-wrap gap-2">
                        {problem.referenceSolution.map((sol) => (
                          <button
                            key={sol.language}
                            onClick={() => setSolutionLanguage(sol.language)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                              solutionLanguage === sol.language 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {langMap[sol.language] || sol.language}
                          </button>
                        ))}
                      </div>

                      {/* Solution Code Area */}
                      {activeSolution && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">{langMap[activeSolution.language] || activeSolution.language} Solution</h3>
                            <div className="flex gap-2">
                              <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 transition-colors">
                                <CheckSquare size={14} /> Select All
                              </button>
                              <button 
                                onClick={() => handleCopyCode(activeSolution.completeCode)}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-lg shadow-blue-500/20"
                              >
                                {isCopied ? <CheckCircle size={14} /> : <Copy size={14} />} 
                                {isCopied ? 'Copied!' : 'Copy Code'}
                              </button>
                            </div>
                          </div>
                          
                          <div className="rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-[#1e1e1e] flex flex-col">
                            <div className="p-2">
                              <Editor
                                height="400px"
                                language={monacoLangMap[activeSolution.language.toLowerCase()] || 'cpp'}
                                value={activeSolution.completeCode}
                                theme="vs-dark"
                                options={{
                                  readOnly: true,
                                  minimap: { enabled: false },
                                  scrollBeyondLastLine: false,
                                  fontSize: 14,
                                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                  padding: { top: 16 },
                                }}
                              />
                            </div>
                            <div className="bg-[#2d2d2d] border-t border-slate-700 px-4 py-1.5 flex justify-between items-center text-[11px] text-slate-400 font-mono">
                              <div>Lines: {activeSolution.completeCode.split('\n').length} &nbsp;&nbsp; Characters: {activeSolution.completeCode.length}</div>
                              <div className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span> Read Only</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Solutions are not available for this problem yet.</p>
                  )}
                </div>
              )}

              {/* Submissions Tab */}
              {activeLeftTab === 'submissions' && (
                <div className="pb-10">
                  <h2 className="text-xl font-bold text-white mb-6">Submission History</h2>
                  <SubmissionHistory problemId={problemId} refreshTrigger={submissionCounter} />
                </div>
              )}

              {/* Discussions Tab */}
              {activeLeftTab === 'discussions' && (
                <ProblemDiscussions problemId={problemId} problemTitle={problem?.title} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Workspace */}
      <div className="flex-1 flex flex-col relative bg-[#1a2335]">
        
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between bg-[#151c2c] border-b border-slate-800/60 px-4 py-3 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center text-sm font-bold text-emerald-400">
              <Code2 size={16} className="mr-2" /> Editor
            </span>
            <select 
              className="bg-[#1e293b] border border-slate-700 text-sm font-medium text-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer w-28"
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                const initialCode = problem?.starterCode?.find(
                  sc => sc.language.toLowerCase() === e.target.value || sc.language === langMap[e.target.value]
                )?.initialCode || '';
                setCode(initialCode);
              }}
            >
              <option value="cpp">C++20</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleRun}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/50 text-xs font-bold text-emerald-400 transition-colors"
            >
              <Play size={14} fill="currentColor" /> Run
            </button>
            <button 
              onClick={handleSubmitCode}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-lg shadow-blue-500/20"
            >
              <Send size={14} /> Submit
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 transition-colors ml-2"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors ml-2">
              <Maximize2 size={14} /> Maximize
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={monacoLangMap[selectedLanguage]}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 16 },
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              formatOnPaste: true,
            }}
          />
        </div>

        {/* Console Output Area */}
        <div className="h-[35%] min-h-[250px] border-t border-slate-800/60 bg-[#151c2c] flex flex-col shrink-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/60 bg-[#1a2335]">
            <div className="flex items-center text-[13px] font-bold text-slate-300">
              <Terminal size={14} className="mr-2" /> Console Output
            </div>
            <button className="text-slate-500 hover:text-slate-300"><ChevronDown size={16} /></button>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#1a2335] px-4 border-b border-slate-800/60">
            <button
              onClick={() => setConsoleTab('testcase')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
                consoleTab === 'testcase'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Testcase
            </button>
            <button
              onClick={() => setConsoleTab('result')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
                consoleTab === 'result'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Test Result
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

            {/* ── TESTCASE TAB ─────────────────────────────────────────── */}
            {consoleTab === 'testcase' && (
              <div className="space-y-4">
                {problem?.visibleTestCases?.length > 0 ? (
                  <>
                    <div className="flex gap-2 flex-wrap">
                      {problem.visibleTestCases.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTestCase(idx)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            activeTestCase === idx
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                              : 'bg-[#1e293b] text-slate-400 hover:text-slate-200 border border-slate-700'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-3 bg-[#1e293b]/50 p-4 rounded-xl border border-slate-700">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-widest">Input</span>
                        <div className="bg-[#0f172a] px-4 py-3 rounded-lg text-slate-200 font-mono text-sm whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto">
                          {problem.visibleTestCases[activeTestCase]?.input || '—'}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-widest">Expected Output</span>
                        <div className="bg-[#0f172a] px-4 py-3 rounded-lg text-slate-200 font-mono text-sm whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto">
                          {problem.visibleTestCases[activeTestCase]?.output || '—'}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 italic text-sm">No visible test cases available.</p>
                )}
              </div>
            )}

            {/* ── RESULT TAB ───────────────────────────────────────────── */}
            {consoleTab === 'result' && (
              <>
                {/* Loading */}
                {isSubmitting && (
                  <div className="flex flex-col items-center justify-center h-32 space-y-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">Evaluating your code…</p>
                  </div>
                )}

                {/* Run result */}
                {!isSubmitting && runResult && (
                  <div className="space-y-3">
                    {/* Top verdict banner */}
                    <div className="flex items-center gap-3">
                      {runResult.verdict === 'accepted' && (
                        <span className="text-lg font-bold text-emerald-400">✓ Accepted</span>
                      )}
                      {runResult.verdict === 'wrong_answer' && (
                        <span className="text-lg font-bold text-red-400">✗ Wrong Answer</span>
                      )}
                      {runResult.verdict === 'compilation_error' && (
                        <span className="text-lg font-bold text-yellow-400">✗ Compilation Error</span>
                      )}
                      {runResult.verdict === 'tle' && (
                        <span className="text-lg font-bold text-orange-400">⏱ Time Limit Exceeded</span>
                      )}
                      {runResult.verdict === 'runtime_error' && (
                        <span className="text-lg font-bold text-red-400">✗ Runtime Error</span>
                      )}
                      {runResult.verdict === 'quota_exceeded' && (
                        <span className="text-lg font-bold text-yellow-400">⚠ Submission Limit Reached</span>
                      )}
                      {(!runResult.verdict || runResult.verdict === 'error') && !runResult.success && (
                        <span className="text-lg font-bold text-red-400">✗ Error</span>
                      )}
                      {runResult.runtime > 0 && (
                        <span className="text-xs text-slate-500 font-mono">{runResult.runtime} ms</span>
                      )}
                    </div>

                    {runResult.error && (
                      <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Error</p>
                        <pre className="text-red-300 font-mono text-xs whitespace-pre-wrap">{runResult.error}</pre>
                      </div>
                    )}

                    {runResult.testCases?.map((tc, i) => (
                      <div
                        key={i}
                        className={`rounded-xl border p-4 space-y-3 ${
                          tc.passed
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-red-500/30 bg-red-500/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-200">Test Case {i + 1}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            tc.passed
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {tc.verdict || (tc.passed ? 'Accepted' : 'Wrong Answer')}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                          {tc.input && (
                            <div>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Input</p>
                              <div className="bg-[#0f172a] px-3 py-2 rounded-lg text-slate-300 whitespace-pre-wrap">{tc.input}</div>
                            </div>
                          )}
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Expected Output</p>
                            <div className="bg-[#0f172a] px-3 py-2 rounded-lg text-slate-300 whitespace-pre-wrap">
                              {tc.expectedOutput || '—'}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Your Output</p>
                            <div className={`px-3 py-2 rounded-lg whitespace-pre-wrap ${
                              tc.passed
                                ? 'bg-emerald-500/10 text-emerald-300'
                                : 'bg-red-500/10 text-red-300'
                            }`}>
                              {tc.yourOutput || 'No output'}
                            </div>
                          </div>
                          {(tc.stderr || tc.compileOutput) && (
                            <div>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Stderr / Compile Output</p>
                              <div className="bg-yellow-500/10 px-3 py-2 rounded-lg text-yellow-300 whitespace-pre-wrap">
                                {tc.stderr || tc.compileOutput}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit result */}
                {!isSubmitting && submitResult && !runResult && (
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                      submitResult.accepted
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <span className={`text-2xl font-extrabold ${submitResult.accepted ? 'text-emerald-400' : submitResult.status === 'quota_exceeded' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {submitResult.accepted
                          ? '✓ Accepted'
                          : submitResult.status === 'ce' || submitResult.status === 'compilation_error'
                            ? '✗ Compilation Error'
                            : submitResult.status === 'tle'
                              ? '⏱ Time Limit Exceeded'
                              : submitResult.status === 'quota_exceeded'
                                ? '⚠ Submission Limit Reached'
                                : submitResult.status === 'error'
                                  ? '✗ Internal Error'
                                  : submitResult.status === 're' || submitResult.status === 'runtime_error'
                                    ? '✗ Runtime Error'
                                    : '✗ Wrong Answer'}
                      </span>
                    </div>

                    <div className="flex gap-4 text-sm font-mono text-slate-400">
                      <span>
                        Passed:&nbsp;
                        <span className={submitResult.accepted ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {submitResult.passedTestCases}/{submitResult.totalTestCases}
                        </span>
                      </span>
                      {submitResult.runtime > 0 && <span>Runtime: <span className="text-slate-200">{submitResult.runtime} ms</span></span>}
                      {submitResult.memory  > 0 && <span>Memory: <span className="text-slate-200">{submitResult.memory} KB</span></span>}
                    </div>

                    {(submitResult.error || submitResult.firstFailure?.stderr) && (
                      <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Error Details</p>
                        <pre className="text-red-300 font-mono text-xs whitespace-pre-wrap">
                          {submitResult.error || submitResult.firstFailure?.stderr}
                        </pre>
                      </div>
                    )}

                    {!submitResult.accepted && submitResult.firstFailure && (
                      <div className="border border-red-500/30 bg-red-500/5 p-4 rounded-xl space-y-2 font-mono text-xs">
                        <p className="text-sm font-bold text-slate-200">
                          Failed Test Case
                          <span className="ml-2 text-xs font-normal text-red-400">{submitResult.firstFailure.verdict}</span>
                        </p>
                        {submitResult.firstFailure.stdin && (
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Input</p>
                            <div className="bg-[#0f172a] px-3 py-2 rounded-lg text-slate-300 whitespace-pre-wrap">{submitResult.firstFailure.stdin}</div>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Expected</p>
                          <div className="bg-[#0f172a] px-3 py-2 rounded-lg text-slate-300 whitespace-pre-wrap">{submitResult.firstFailure.expectedOutput || '—'}</div>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Your Output</p>
                          <div className="bg-red-500/10 px-3 py-2 rounded-lg text-red-300 whitespace-pre-wrap">{submitResult.firstFailure.yourOutput || 'No output'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty state */}
                {!isSubmitting && !runResult && !submitResult && (
                  <div className="flex flex-col items-center justify-center h-28 text-slate-500 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
                      <Code2 size={18} className="text-slate-600" />
                    </div>
                    <p className="font-semibold text-slate-400 text-sm">Run your code to see results</p>
                    <p className="text-xs">Click <span className="text-emerald-400 font-bold">Run</span> to test or <span className="text-blue-400 font-bold">Submit</span> to judge.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default ProblemPage;