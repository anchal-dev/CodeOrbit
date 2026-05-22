import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, Trophy, MessageSquare, Menu, User, 
  LogOut, Settings, Gamepad2, Briefcase, MessagesSquare, X, ChevronRight, Bell
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navLinks = [
    { name: 'Problems', path: '/problems', icon: <Code2 size={16} /> },
    { name: 'Discuss', path: '/forum', icon: <MessageSquare size={16} /> },
    { name: 'Contests', path: '/contests', icon: <Trophy size={16} /> },
    { name: 'Game', path: '/game', icon: <Gamepad2 size={16} /> },
    { name: 'Interview', path: '/interview', icon: <Briefcase size={16} /> },
    { name: 'Chat', path: '/chat', icon: <MessagesSquare size={16} /> },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-[#0f172a]/70 backdrop-blur-xl border-slate-800/50 shadow-2xl shadow-indigo-500/5' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo area */}
            <div className="flex items-center gap-2">
              <button 
                className="lg:hidden p-2 text-slate-300 hover:text-white"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              <NavLink to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 transform group-hover:scale-105">
                  <Code2 size={24} className="text-white" />
                </div>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-slate-400 tracking-tight">
                  CodeOrbit
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name}
                  to={link.path} 
                  className={({isActive}) => `
                    relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group overflow-hidden
                    ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10 flex items-center gap-1.5">
                        <span className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'}`}>
                          {link.icon}
                        </span>
                        {link.name}
                      </span>
                      {isActive && (
                        <motion.div 
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-full z-0"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                   <div className="hidden md:flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                     <span className="text-sm font-bold text-orange-400 flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        🪙 {user.orbitCoins ?? user.points ?? 0} pts
                     </span>
                   </div>
                   
                  <NotificationDropdown />
                  
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:bg-transparent">
                      <div className="w-10 h-10 rounded-full ring-2 ring-indigo-500/50 hover:ring-indigo-400 ring-offset-2 ring-offset-[#0f172a] transition-all transform hover:scale-110">
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff&bold=true`} alt="avatar" />
                      </div>
                    </label>
                    <ul tabIndex={0} className="mt-4 p-2 shadow-2xl menu menu-sm dropdown-content bg-[#1e293b]/95 backdrop-blur-xl rounded-2xl w-64 border border-slate-700 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-slate-700/50 mb-2">
                        <p className="text-sm text-slate-400">Signed in as</p>
                        <p className="text-base font-bold text-white truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-indigo-400 mt-1 font-mono">{user.email}</p>
                      </div>
                      
                      <li>
                        <NavLink to="/profile" className="py-2 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors">
                          <User size={16} className="text-indigo-400"/> Profile Overview
                        </NavLink>
                      </li>
                      
                      {user.role === 'admin' && (
                        <li>
                          <NavLink to="/admin" className="py-2 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors">
                            <Settings size={16} className="text-emerald-400"/> Admin Console
                          </NavLink>
                        </li>
                      )}
                      
                      <div className="divider my-1 border-slate-700/50 h-px bg-slate-700/50 mx-2"></div>
                      
                      <li>
                        <button onClick={handleLogout} className="py-2 hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition-colors">
                          <LogOut size={16} /> Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <NavLink to="/login" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                    Sign In
                  </NavLink>
                  <NavLink to="/signup" className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                    <button className="relative flex items-center gap-2 bg-[#0f172a] hover:bg-slate-900 border border-slate-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300">
                      Start Learning <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-3/4 max-w-sm bg-[#1e293b] border-r border-slate-800 z-[70] p-6 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Code2 size={20} className="text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">CodeOrbit</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col space-y-2 flex-1">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({isActive}) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors
                      ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                    `}
                  >
                    {link.icon} {link.name}
                  </NavLink>
                ))}
              </div>

              {!user && (
                <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-slate-800">
                  <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline border-slate-700 text-slate-300">
                    Sign In
                  </NavLink>
                  <NavLink to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn bg-indigo-600 border-none text-white hover:bg-indigo-500">
                    Start Learning
                  </NavLink>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
