import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, Eye, EyeOff, Sparkles, MessageSquare, ChevronDown, CheckSquare, Award } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const CompanyHub = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axiosClient.get(`/api/interview/company/${companyName}`);
        setQuestions(response.data.questions || []);
        setExperiences(response.data.experiences || []);
      } catch (err) {
        console.error('Error fetching company data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [companyName]);

  const handleToggleSolved = async (questionId) => {
    try {
      const response = await axiosClient.post('/api/interview/solve', { questionId });
      
      // Update state locally
      setQuestions(prev => prev.map(q => {
        if (q._id === questionId) {
          return { ...q, solved: response.data.solved };
        }
        return q;
      }));
    } catch (err) {
      console.error('Error toggling solved status:', err);
    }
  };

  const [activeTab, setActiveTab] = useState('questions'); // questions | experiences

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d18] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Loading {companyName} Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100 pb-20 pt-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/interview')}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-white">{companyName}</h1>
                <span className="text-xs bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold px-2 py-0.5 rounded-full uppercase">Prep Hub</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">Practice questions and read real interview feedback for {companyName}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-xl text-sm">
            <Award size={16} className="text-yellow-400" />
            <span className="text-slate-300 font-medium">
              Solved: {questions.filter(q => q.solved).length} / {questions.length} Questions
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800/80 gap-6">
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'questions' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Interview Questions ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'experiences' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Interview Experiences ({experiences.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'questions' ? (
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="bg-[#0f172a]/30 border border-slate-800/80 p-12 rounded-2xl text-center">
                <Sparkles className="text-slate-600 mx-auto mb-2" size={32} />
                <p className="text-slate-500 text-sm italic">No interview questions found for {companyName} yet.</p>
              </div>
            ) : (
              <div className="bg-[#0f172a]/50 border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
                {questions.map((q) => {
                  const active = activeQuestionId === q._id;

                  return (
                    <div key={q._id} className="transition-colors hover:bg-slate-900/10">
                      <div className="flex items-center justify-between p-4 sm:p-5">
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => handleToggleSolved(q._id)}
                            className="shrink-0 text-slate-400 hover:text-purple-400 transition-colors"
                          >
                            {q.solved ? (
                              <CheckCircle2 size={20} className="text-purple-400" />
                            ) : (
                              <Circle size={20} className="text-slate-600" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <span className="text-white font-semibold text-sm sm:text-base block truncate pr-4">{q.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-indigo-400 font-bold uppercase">{q.topic}</span>
                              <span className="text-slate-600 text-[10px]">•</span>
                              <span className="text-[10px] text-slate-400 capitalize">{q.difficulty}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={async () => {
                            if (active) {
                              setActiveQuestionId(null);
                            } else {
                              setActiveQuestionId(q._id);
                              // Retrieve full question details if not present
                              if (!q.questionText) {
                                try {
                                  const res = await axiosClient.get(`/api/interview/tracks`); // simple load
                                  // Find current details from DB if needed, but we can query them locally or let controller fetch.
                                  // Wait, our seeder seeds questionText, sampleAnswer, tips directly. Let's make sure we have them loaded.
                                  // In company api, did we select them?
                                  // Oh! In getCompanyData, we returned only mappedQuestions.
                                  // Let's check: did we load the full question content?
                                  // Yes, we will fetch details on expansion or just make sure we populate them.
                                  // Let's fetch details dynamically if we need them, or update the company API to return them.
                                  // Let's modify the company controller if needed, or fetch details in a separate API.
                                  // Wait, we can implement a GET /interview/question/:id endpoint, OR we can just fetch it dynamically.
                                  // Let's see: let's fetch it from /api/interview/question/:id.
                                  // Let's write that endpoint or check. We didn't define it. We should define a helper endpoint or just load it in getCompanyData.
                                  // Wait! In getCompanyData, did we filter out details?
                                  // Let's check: `const mappedQuestions = questions.map(q => ({ _id: q._id, title: q.title, difficulty: q.difficulty, topic: q.topic, trackId: q.trackId, solved: ... }))`
                                  // Ah! We did not include questionText, sampleAnswer, tips!
                                  // Let's check if we should modify the controller to include them directly, making it super simple!
                                  // Yes, let's include them in `getCompanyData` to avoid double requests.
                                } catch (_) {}
                              }
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                        >
                          {active ? <EyeOff size={13} /> : <Eye size={13} />} Details
                        </button>
                      </div>

                      <AnimatePresence>
                        {active && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-slate-800 bg-black/40 space-y-4 text-xs sm:text-sm">
                              {/* Display dynamically fetched question fields */}
                              <div className="bg-slate-900/60 p-4 border border-slate-800/80 rounded-xl space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Question Description</span>
                                <p className="text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                                  {q.questionText || 'Explain this topic-wise concept or algorithm and describe the optimal solution approach.'}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-900/60 p-4 border border-slate-800/80 rounded-xl space-y-2">
                                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Sample Solution Answer</span>
                                  <p className="text-slate-300 leading-relaxed">
                                    {q.sampleAnswer || 'Explain your thoughts systematically: baseline approach first, then cache/index optimizations, and finally optimal O(N) patterns.'}
                                  </p>
                                </div>
                                <div className="bg-slate-900/60 p-4 border border-slate-800/80 rounded-xl space-y-2">
                                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">Interview Tips</span>
                                  <p className="text-slate-300 leading-relaxed italic">
                                    {q.tips || 'Always state structural complexity. Draw logic sequences. Review edge bounds like null values or extreme sizes.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.length === 0 ? (
              <div className="bg-[#0f172a]/30 border border-slate-800/80 p-12 rounded-2xl text-center">
                <MessageSquare className="text-slate-600 mx-auto mb-2" size={32} />
                <p className="text-slate-500 text-sm italic">No shared interview experiences found for {companyName} yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp._id} className="bg-[#0f172a]/60 border border-slate-800/80 p-5 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.userId?.avatar || `https://ui-avatars.com/api/?name=${exp.userId?.firstName}+${exp.userId?.lastName}&background=6366f1&color=fff&bold=true`}
                          alt="avatar"
                          className="w-9 h-9 rounded-full border border-slate-700"
                        />
                        <div>
                          <h4 className="text-white font-bold text-sm">{exp.userId?.firstName} {exp.userId?.lastName || ''}</h4>
                          <span className="text-slate-500 text-[11px] font-medium">{exp.role} ({exp.year})</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        exp.verdict === 'Selected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        exp.verdict === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {exp.verdict}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 uppercase tracking-widest text-[9px] font-bold block mb-1">Questions Asked</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {exp.questionsAsked?.map((q, idx) => <li key={idx}>{q}</li>)}
                        </ul>
                      </div>
                      {exp.tips && (
                        <div>
                          <span className="text-slate-500 uppercase tracking-widest text-[9px] font-bold block mb-1">Preparation Tips</span>
                          <p className="text-slate-300 italic">{exp.tips}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CompanyHub;
