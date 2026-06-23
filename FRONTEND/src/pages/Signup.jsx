import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

const ParticleBackground = React.memo(() => {
  const particles = React.useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.1,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse duration-10000" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse duration-8000 delay-1000" />
      
      {/* Tiny Stars */}
      {particles.map((p) => (
        <div 
          key={p.id} 
          className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle"
          style={{
            top: p.top,
            left: p.left,
            opacity: p.opacity,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration
          }}
        />
      ))}
    </div>
  );
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#020617] text-slate-100 overflow-hidden pt-28 pb-16">
      
      {/* Background and particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#081028] to-[#0f172a] -z-20" />
      <ParticleBackground />
      
      {/* Subtle radial glow behind the form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[460px] bg-[#0f172a]/85 backdrop-blur-[20px] border border-white/8 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 md:p-10 z-10"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white mb-2 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Create your CodeOrbit Account
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[320px] mx-auto">
            Join contests, solve problems, earn points, and grow.
          </p>
        </div>

        {/* Backend / Redux authentication errors */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3.5 mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Name field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="John"
                className={`w-full h-[52px] pl-11 pr-4 bg-[#0f172a] border ${
                  errors.firstName ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/80 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 rounded-xl transition-all`}
                {...register('firstName')}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs font-semibold text-red-400 pl-1 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="john@example.com"
                className={`w-full h-[52px] pl-11 pr-4 bg-[#0f172a] border ${
                  errors.emailId ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/80 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 rounded-xl transition-all`}
                {...register('emailId')}
              />
            </div>
            {errors.emailId && (
              <p className="text-xs font-semibold text-red-400 pl-1 mt-1">
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full h-[52px] pl-11 pr-11 bg-[#0f172a] border ${
                  errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/80 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 rounded-xl transition-all`}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-semibold text-red-400 pl-1 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] hover:from-[#8b5cf6] hover:to-[#6366f1] text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:pointer-events-none mt-2 text-sm cursor-pointer"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Redirect link */}
        <p className="text-center text-xs text-slate-400 mt-8 leading-none">
          Already have an account?{' '}
          <NavLink
            to="/login"
            className="font-bold text-purple-400 hover:text-purple-300 transition-colors underline decoration-purple-500/30"
          >
            Sign In
          </NavLink>
        </p>
      </motion.div>

      {/* Particle animation stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 10px 2px rgba(255,255,255,0.3); }
        }
        .animate-twinkle {
          animation: twinkle linear infinite;
        }
      `}} />
    </div>
  );
}

export default Signup;