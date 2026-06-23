import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, Eye, EyeOff, Sparkles, Award, Code2, Cpu, Database, Globe, Layers, BookOpen } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const TrackHub = () => {
  const { trackName } = useParams();
  const navigate = useNavigate();

  const [track, setTrack] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [activeTopic, setActiveTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const response = await axiosClient.get(`/api/interview/track/${trackName}`);
        setTrack(response.data.track || null);
        setQuestions(response.data.questions || []);
        
        // Auto-select the first topic that has questions
        if (response.data.questions && response.data.questions.length > 0) {
          setActiveTopic(response.data.questions[0].topic);
        }
      } catch (err) {
        console.error('Error fetching track data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrackData();
  }, [trackName]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d18] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Loading Track Portal...</p>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-[#080d18] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-lg">Track not found.</p>
        <button
          onClick={() => navigate('/interview')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-all"
        >
          Back to Interview Hub
        </button>
      </div>
    );
  }

  // Get unique topics for this track
  const topics = [...new Set(questions.map(q => q.topic))];

  // Filter questions by active topic
  const filteredQuestions = questions.filter(q => q.topic === activeTopic);
  const totalSolvedInTrack = questions.filter(q => q.solved).length;

  const TrackIcon = {
    dsa: Code2, os: Cpu, dbms: Database, cn: Globe, oop: Layers
  }[trackName] || BookOpen;

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100 pb-20 pt-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/interview')}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all shrink-0 mt-1"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <TrackIcon size={20} />
                </div>
                <h1 className="text-3xl font-black text-white">{track.title}</h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                  track.difficulty.toLowerCase() === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  track.difficulty.toLowerCase() === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {track.difficulty}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">{track.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0f172a]/60 border border-slate-800/80 p-4 rounded-2xl md:self-start shrink-0">
            <Award size={20} className="text-yellow-400" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Total Progress</span>
              <span className="text-white font-bold text-base">
                {totalSolvedInTrack} / {questions.length} Solved
              </span>
            </div>
          </div>
        </div>

        {/* Layout: Left Sidebar Topics, Right Side Questions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Topics Sidebar */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-lg font-bold text-white pl-1">Topics</h2>
            <div className="bg-[#0f172a]/40 border border-slate-800/80 p-3 rounded-2xl space-y-1">
              {topics.map(topic => {
                const topicQuestions = questions.filter(q => q.topic === topic);
                const solvedCount = topicQuestions.filter(q => q.solved).length;
                const isSelected = activeTopic === topic;

                return (
                  <button
                    key={topic}
                    onClick={() => {
                      setActiveTopic(topic);
                      setActiveQuestionId(null);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-purple-600/25 border border-purple-500/40 text-purple-200'
                        : 'border border-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{topic}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {solvedCount}/{topicQuestions.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions Panel */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between pl-1">
              <h2 className="text-lg font-bold text-white">{activeTopic || 'Questions'}</h2>
              <span className="text-xs text-slate-500">{filteredQuestions.length} questions available</span>
            </div>

            <div className="bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
              {filteredQuestions.length === 0 ? (
                <div className="p-12 text-center">
                  <Sparkles size={32} className="text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm italic">No questions seeded for this topic yet.</p>
                </div>
              ) : (
                filteredQuestions.map(q => {
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
                            <span className={`text-[10px] uppercase font-bold ${
                              q.difficulty === 'hard' ? 'text-red-400' :
                              q.difficulty === 'medium' ? 'text-orange-400' :
                              'text-emerald-400'
                            }`}>
                              {q.difficulty}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveQuestionId(active ? null : q._id);
                          }}
                          className="px-3 py-1.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
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
                              <div className="bg-slate-900/60 p-4 border border-slate-800/80 rounded-xl space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Question Description</span>
                                <p className="text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                                  {q.questionText}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-900/60 p-4 border border-slate-800/80 rounded-xl space-y-2">
                                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Sample Solution Answer</span>
                                  <p className="text-slate-300 leading-relaxed">{q.sampleAnswer}</p>
                                </div>
                                <div className="bg-slate-900/60 p-4 border border-slate-800/80 rounded-xl space-y-2">
                                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">Interview Tips</span>
                                  <p className="text-slate-300 leading-relaxed italic">{q.tips}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TrackHub;
