import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../utils/axiosClient';
import { checkAuth } from '../authSlice';
import {
  User, Code2, Link2, Award, Clock, Star, Edit2, X,
  CheckCircle, XCircle, Trophy, TrendingUp,
  Flame, Save, ChevronRight, ExternalLink
} from 'lucide-react';

/* ── helpers ── */
const statusMeta = (status) => {
  const s = (status ?? '').toLowerCase();
  if (s === 'accepted')
    return { label: 'Accepted', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  return { label: status ?? 'Wrong', cls: 'text-red-400 bg-red-500/10 border-red-500/30' };
};

const fmt = (dateStr) => {
  if (!dateStr) return '–';
  try { return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return '–'; }
};

/* ── stat card ── */
const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="relative bg-[#111827] border border-white/10 rounded-2xl p-5 overflow-hidden flex flex-col justify-between h-[120px] backdrop-blur-sm"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.bg}`}>
      <Icon size={20} className={color.text} />
    </div>
    <div>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
      <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
    </div>
    {/* subtle glow */}
    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-20 ${color.glow}`} />
  </motion.div>
);

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [profileData, setProfileData]       = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [editing, setEditing]               = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [formData, setFormData]             = useState({ bio: '', github: '', linkedin: '', avatar: '' });

  /* ── fetch ── */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/profile/${user._id}`);
      setProfileData(data.user);
      setRecentSubmissions(Array.isArray(data.recentSubmissions) ? data.recentSubmissions : []);
      setFormData({
        bio:      data.user?.bio      || '',
        github:   data.user?.github   || '',
        linkedin: data.user?.linkedin || '',
        avatar:   data.user?.avatar   || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setRecentSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?._id) fetchProfile(); }, [user]);

  /* ── save ── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosClient.put(`/profile/${user._id}`, formData);
      setEditing(false);
      await fetchProfile();
      dispatch(checkAuth());
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  /* ── loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <span className="loading loading-spinner loading-lg text-indigo-500" />
          <p className="text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  const avatarUrl = profileData?.avatar
    || `https://ui-avatars.com/api/?name=${encodeURIComponent((profileData?.firstName || 'U') + '+' + (profileData?.lastName || ''))}&background=6366f1&color=fff&bold=true&size=200`;

  const fullName = `${profileData?.firstName ?? ''} ${profileData?.lastName ?? ''}`.trim() || 'Anonymous';
  const handle   = `@${(profileData?.firstName ?? 'user').toLowerCase()}${(profileData?.lastName ?? '').toLowerCase()}`;

  /* ── solved breakdown (if available) ── */
  const solved   = profileData?.problemSolved?.length ?? 0;
  const contests = profileData?.contestsParticipated?.length ?? 0;
  const points   = profileData?.points ?? 0;
  const rep      = profileData?.reputation ?? 0;

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-300 pt-32 md:pt-36 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* ── Page Title ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <User size={18} className="text-white" />
            </span>
            My Profile
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-[52px]">Your coding journey at a glance</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ══ LEFT SIDEBAR ══ */}
          <div className="lg:col-span-1 space-y-5">

            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="relative bg-[#111827] border border-white/10 rounded-3xl p-6 overflow-hidden backdrop-blur-sm shadow-2xl"
            >
              {/* Top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              {/* Avatar */}
              <div className="flex flex-col items-center text-center pt-4">
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full ring-4 ring-indigo-500/40 ring-offset-4 ring-offset-[#111827] overflow-hidden shadow-xl shadow-indigo-500/20">
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  {/* online dot */}
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#111827]" />
                </div>

                <h2 className="text-xl font-black text-white">{fullName}</h2>
                <p className="text-xs text-slate-400 mt-0.5 mb-3">{handle}</p>

                {/* Points badge */}
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                  <Star size={12} fill="currentColor" /> {points} Points
                </div>

                {/* Reputation badge */}
                {rep > 0 && (
                  <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                    <Flame size={12} /> {rep} Reputation
                  </div>
                )}

                {/* Bio */}
                {profileData?.bio && (
                  <p className="text-slate-300 text-sm italic leading-relaxed mb-4 px-2">
                    "{profileData.bio}"
                  </p>
                )}

                {/* Social links */}
                <div className="flex gap-3 mb-5">
                  {profileData?.github && (
                    <a
                      href={profileData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                      className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all"
                    >
                      <Code2 size={16} />
                    </a>
                  )}
                  {profileData?.linkedin && (
                    <a
                      href={profileData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
                    >
                      <Link2 size={16} />
                    </a>
                  )}
                </div>

                {/* Edit button */}
                <button
                  onClick={() => setEditing(!editing)}
                  className={`w-full flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    editing
                      ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                      : 'bg-indigo-600 border-transparent text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25'
                  }`}
                >
                  {editing ? <X size={15} /> : <Edit2 size={15} />}
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </motion.div>

            {/* Edit form */}
            <AnimatePresence>
              {editing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="relative bg-[#111827] border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl" />
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Edit2 size={14} className="text-indigo-400" /> Edit Details
                    </h3>
                    <form onSubmit={handleUpdate} className="space-y-3">
                      {[
                        { key: 'avatar',   label: 'Avatar URL',   placeholder: 'https://…', type: 'text' },
                        { key: 'github',   label: 'GitHub URL',   placeholder: 'https://github.com/…', type: 'text' },
                        { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/…', type: 'text' },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">{label}</label>
                          <input
                            type="text"
                            value={formData[key]}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            placeholder={placeholder}
                            className="w-full bg-[#0B1020] border border-white/10 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Tell the community about yourself…"
                          rows={3}
                          className="w-full bg-[#0B1020] border border-white/10 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600 resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-60"
                      >
                        {saving ? <span className="loading loading-spinner loading-xs" /> : <Save size={14} />}
                        {saving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={Award}
                label="Problems Solved"
                value={solved}
                delay={0.05}
                color={{ bg: 'bg-indigo-500/15', text: 'text-indigo-400', glow: 'bg-indigo-500' }}
              />
              <StatCard
                icon={Trophy}
                label="Contests Joined"
                value={contests}
                delay={0.1}
                color={{ bg: 'bg-amber-500/15', text: 'text-amber-400', glow: 'bg-amber-500' }}
              />
              <StatCard
                icon={TrendingUp}
                label="Reputation"
                value={rep}
                delay={0.15}
                color={{ bg: 'bg-emerald-500/15', text: 'text-emerald-400', glow: 'bg-emerald-500' }}
              />
            </div>

            {/* ── Recent Submissions ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="relative bg-[#111827] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />

              <div className="px-6 pt-6 pb-2 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                  <Clock size={15} className="text-purple-400" />
                </span>
                <h2 className="text-base font-bold text-white">Recent Submissions</h2>
                {recentSubmissions.length > 0 && (
                  <span className="ml-auto text-xs font-bold text-slate-400">
                    {recentSubmissions.length} record{recentSubmissions.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {!Array.isArray(recentSubmissions) || recentSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                    <Code2 size={20} className="text-slate-400" />
                  </div>
                  <p className="text-slate-300 font-semibold text-sm">No submissions yet</p>
                  <p className="text-slate-500 text-xs">Solve a problem to see your activity here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto px-4 pb-5 pt-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 pb-3 pr-4">Problem</th>
                        <th className="text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 pb-3 pr-4">Status</th>
                        <th className="text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 pb-3 pr-4">Language</th>
                        <th className="text-right text-[11px] font-bold uppercase tracking-widest text-slate-400 pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSubmissions.map((sub, i) => {
                        const meta = statusMeta(sub?.status);
                        return (
                          <motion.tr
                            key={sub?._id ?? i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.04 }}
                            className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group"
                          >
                            <td className="py-3 pr-4">
                              <span className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                                {sub?.problemId?.title || 'Unknown Problem'}
                                <ChevronRight size={12} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${meta.cls}`}>
                                {meta.label === 'Accepted'
                                  ? <CheckCircle size={10} />
                                  : <XCircle size={10} />
                                }
                                {meta.label}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                                {sub?.language ?? '–'}
                              </span>
                            </td>
                            <td className="py-3 text-right text-xs text-slate-400">
                              {fmt(sub?.createdAt)}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* ── Solved problems streak/breakdown placeholder ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.28 }}
              className="relative bg-[#111827] border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <Flame size={15} className="text-emerald-400" />
                </span>
                <h2 className="text-base font-bold text-white">Solved Problems</h2>
                <span className="ml-auto text-2xl font-black text-emerald-400">{solved}</span>
              </div>
              {solved === 0 ? (
                <p className="text-slate-400 text-sm">Start solving to track your progress!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(profileData?.problemSolved ?? []).slice(0, 20).map((prob, i) => (
                    <span
                      key={prob?._id ?? i}
                      className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md"
                    >
                      {prob?.title ?? `#${i + 1}`}
                    </span>
                  ))}
                  {solved > 20 && (
                    <span className="text-[11px] text-slate-400 px-2 py-0.5">+{solved - 20} more</span>
                  )}
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
