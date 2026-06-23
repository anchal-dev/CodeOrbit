import React from 'react';
import { NavLink } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, CheckCircle, Zap, Trophy, Star, MessageSquare } from 'lucide-react';

const LoginRequiredModal = ({ isOpen, onClose, action = 'perform this action' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md"
            >
              {/* Glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl pointer-events-none" />

              <div className="relative bg-[#0f1629]/95 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 transition-all duration-200"
                >
                  <X size={18} />
                </button>

                <div className="p-8">
                  {/* Icon */}
                  <div className="flex justify-center mb-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                        <Lock size={28} className="text-indigo-400" />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white mb-2">Login Required</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Create a free account to {action} and unlock the full CodeOrbit experience.
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2.5 mb-7 bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
                    {[
                      { icon: <Zap size={15} className="text-emerald-400" />, text: 'Submit solutions & track progress' },
                      { icon: <Trophy size={15} className="text-orange-400" />, text: 'Join contests & climb leaderboards' },
                      { icon: <Star size={15} className="text-yellow-400" />, text: 'Earn OrbitCoins & unlock rewards' },
                      { icon: <MessageSquare size={15} className="text-blue-400" />, text: 'Participate in discussions & forums' },
                    ].map(({ icon, text }, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-slate-700/60 flex items-center justify-center">
                          {icon}
                        </div>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-3">
                    <NavLink to="/signup" onClick={onClose} className="w-full">
                      <div className="relative group w-full">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-90 transition duration-300" />
                        <button className="relative w-full py-3 px-6 rounded-xl bg-[#0f1629] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200">
                          <Zap size={16} className="text-indigo-400" />
                          Create Free Account
                        </button>
                      </div>
                    </NavLink>

                    <NavLink to="/login" onClick={onClose} className="w-full">
                      <button className="w-full py-3 px-6 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-bold text-sm transition-all duration-200">
                        Sign In
                      </button>
                    </NavLink>
                  </div>

                  {/* Footer note */}
                  <p className="text-center text-xs text-slate-600 mt-4">
                    Free forever · No credit card required
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginRequiredModal;
