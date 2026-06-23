import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { CheckCircle, Circle, Trophy, Star, Search, Filter, CheckCheck } from 'lucide-react';

function ProblemsPage() {
  const { user } = useSelector((state) => state.auth);
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get('topic');

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ difficulty: 'all', tag: topicParam || 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ── POTD state ──────────────────────────────────────────────────────────────
  const [potd, setPotd]         = useState(null);
  const [potdLoading, setPotdLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data.solvedProblems || []);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    const fetchPOTD = async () => {
      try {
        const { data } = await axiosClient.get('/potd');
        setPotd(data);
      } catch (err) {
        console.error('Error fetching POTD:', err);
      } finally {
        setPotdLoading(false);
      }
    };

    fetchProblems();
    fetchPOTD();
    if (user?._id) fetchSolvedProblems();
  }, [user?._id]);

  // Sync URL topic param to local filter state
  useEffect(() => {
    if (topicParam) {
      setFilters(prev => ({ ...prev, tag: topicParam }));
    } else {
      setFilters(prev => ({ ...prev, tag: 'all' }));
    }
  }, [topicParam]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  const filteredProblems = problems.filter(problem => {
    const searchMatch = problem.title.toLowerCase().includes(search.toLowerCase());
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty?.toLowerCase() === filters.difficulty.toLowerCase();
    const tagMatch = filters.tag === 'all' || (problem.tags && problem.tags.includes(filters.tag));
    return searchMatch && difficultyMatch && tagMatch;
  });

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20';
      case 'medium': return 'text-orange-500 bg-orange-500/10 border border-orange-500/20';
      case 'hard': return 'text-red-500 bg-red-500/10 border border-red-500/20';
      default: return 'text-slate-400 bg-slate-800 border border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pt-28 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Problem of the Day Banner */}
        <div className={`relative rounded-2xl overflow-hidden border shadow-2xl transition-all duration-500 ${
          potd?.solvedToday
            ? 'border-emerald-500/40 bg-[#1e293b] shadow-emerald-500/5'
            : 'border-orange-500/30 bg-[#1e293b] shadow-orange-500/5'
        }`}>
          {/* Top gradient line */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
            potd?.solvedToday
              ? 'from-emerald-500 via-teal-400 to-cyan-500'
              : 'from-orange-600 via-amber-500 to-yellow-500'
          }`} />

          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-lg ${
                  potd?.solvedToday
                    ? 'bg-emerald-500/20 border-emerald-500/30 shadow-emerald-500/30'
                    : 'bg-orange-500/20 border-orange-500/30 shadow-orange-500/30'
                }`}>
                  {potd?.solvedToday
                    ? <CheckCheck className="text-emerald-400" size={24} />
                    : <Star className="text-orange-400" size={24} fill="currentColor" />
                  }
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Problem of the Day</h2>
                  <p className={`font-bold text-sm ${potd?.solvedToday ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {potd?.solvedToday ? '✔ You solved today\'s challenge!' : 'Solve today\'s challenge and earn coins!'}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <span className={`inline-block px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg ${
                  potd?.solvedToday
                    ? 'bg-emerald-600 shadow-emerald-600/30'
                    : 'bg-orange-600 shadow-orange-600/30'
                }`}>
                  {potd?.solvedToday ? '✓ +10 Coins Earned' : '+10 OrbitCoins'}
                </span>
              </div>

              <div className="bg-[#0f172a]/50 border border-slate-700/50 rounded-xl p-4 md:w-3/4">
                {potdLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-5 bg-slate-700 rounded w-48" />
                    <div className="h-4 bg-slate-800 rounded w-32" />
                  </div>
                ) : potd?.problem ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-3">{potd.problem.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getDifficultyColor(potd.problem.difficulty)}`}>
                        {potd.problem.difficulty}
                      </span>
                      {potd.problem.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20">
                          {tag}
                        </span>
                      ))}
                      {potd.problem.acceptanceRate && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700">
                          {potd.problem.acceptanceRate.toFixed(1)}% accepted
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 text-sm">No problem available today.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              {potd?.solvedToday ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <CheckCheck className="text-emerald-400" size={28} />
                  </div>
                  <p className="text-emerald-400 text-xs font-bold">Solved Today!</p>
                </div>
              ) : (
                <button
                  onClick={() => potd?.problem && navigate(`/problem/${potd.problem._id}`)}
                  disabled={!potd?.problem}
                  className="btn bg-orange-600 hover:bg-orange-500 border-none text-white px-8 rounded-lg font-bold shadow-lg shadow-orange-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  <Trophy size={18} /> Solve Now
                </button>
              )}
              <p className="text-slate-500 text-xs font-bold">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Topic Header */}
        {topicParam && (
          <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-900/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/50">
                <Filter className="text-indigo-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{topicParam} Problems</h2>
                <p className="text-indigo-300 font-medium text-sm">
                  Showing {filteredProblems.length} problem{filteredProblems.length !== 1 && 's'} in this category
                </p>
              </div>
            </div>
            <button 
              onClick={() => { navigate('/problems'); setFilters({...filters, tag: 'all'}); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-colors"
            >
              Clear Topic Filter
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-[#1e293b]/60 p-3 rounded-xl border border-slate-700/50 backdrop-blur-md">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search problems by title, description..." 
              className="w-full bg-[#0f172a] border border-slate-700 text-sm text-slate-200 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-3">
            <select 
              className="bg-[#0f172a] border border-slate-700 text-sm font-medium text-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer w-full md:w-48"
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select 
              className="bg-[#0f172a] border border-slate-700 text-sm font-medium text-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer w-full md:w-48"
              value={filters.tag}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'all') navigate('/problems');
                else navigate(`/problems?topic=${encodeURIComponent(val)}`);
              }}
            >
              <option value="all">All Tags</option>
              {Array.from(new Set(problems.flatMap(p => p.tags || []))).sort().map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <button 
              onClick={() => { setSearch(''); navigate('/problems'); setFilters({difficulty: 'all', tag: 'all'}); }}
              className="bg-[#0f172a] hover:bg-slate-800 border border-slate-700 text-sm font-medium text-slate-300 rounded-lg px-4 py-2.5 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Filter size={16} /> Clear Filters
            </button>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-[#1e293b]/60 rounded-xl border border-slate-700/50 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-700/50 text-[10px] text-slate-500 font-bold tracking-wider uppercase bg-[#0f172a]/30">
                  <th className="py-4 px-6 w-16 text-center">Status</th>
                  <th className="py-4 px-6">Problem</th>
                  <th className="py-4 px-6 w-32">Difficulty</th>
                  <th className="py-4 px-6 w-40">Acceptance Rate</th>
                  <th className="py-4 px-6">Tags</th>
                  <th className="py-4 px-6">Companies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {paginatedProblems.map((problem) => {
                  const isSolved = solvedProblems.some(sp => sp._id === problem._id);
                  return (
                    <tr key={problem._id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-4 px-6 text-center">
                        {isSolved ? (
                          <CheckCircle className="text-emerald-500 w-5 h-5 mx-auto" />
                        ) : (
                          <Circle className="text-slate-700 w-5 h-5 mx-auto group-hover:text-slate-500 transition-colors" />
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <NavLink to={`/problem/${problem._id}`} className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                          {problem.title}
                        </NavLink>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-200">
                        {problem.acceptanceRate ? `${problem.acceptanceRate.toFixed(1)}%` : '100.0%'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {problem.tags && problem.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-1.5 items-center">
                          {problem.companies && problem.companies.slice(0, 2).map(company => (
                            <span key={company} className="px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                              {company}
                            </span>
                          ))}
                          {problem.companies && problem.companies.length > 2 && (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700">
                              +{problem.companies.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredProblems.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center text-slate-500">
                        <Search size={32} className="mb-3 opacity-20" />
                        <p className="font-medium">No problems found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <span className="text-xs font-bold text-slate-400">
            Showing page {currentPage} of {totalPages || 1}
          </span>
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1.5 rounded bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 py-1.5 rounded text-xs font-bold transition-colors ${
                  currentPage === i + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300'
                }`}
              >
                {i + 1}
              </button>
            )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-1.5 rounded bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProblemsPage;
