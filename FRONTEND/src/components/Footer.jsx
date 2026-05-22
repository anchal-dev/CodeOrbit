import React from 'react';
import { NavLink } from 'react-router';
import { Code2, Code, Mail, Link, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0f1c] text-slate-300 border-t border-slate-800 relative overflow-hidden font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Intro */}
          <div className="lg:col-span-2 space-y-6">
            <NavLink to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Code2 size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                CodeOrbit
              </span>
            </NavLink>
            <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
              Master coding skills with our comprehensive platform featuring problems, contests, and real-time battles. Join thousands of developers improving their skills every day.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://github.com/anchal-dev" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#1e293b] border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors">
                <Code size={18} />
              </a>
              <a href="mailto:guptanchal009@gmail.com" className="w-10 h-10 rounded-lg bg-[#1e293b] border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors">
                <Mail size={18} />
              </a>
              <a href="https://www.linkedin.com/in/anchalgupta009/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#1e293b] border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors">
                <Link size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide">Quick Links</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><NavLink to="/problems" className="text-slate-400 hover:text-indigo-400 transition-colors">Problems</NavLink></li>
              <li><NavLink to="/contests" className="text-slate-400 hover:text-indigo-400 transition-colors">Contests</NavLink></li>
              <li><NavLink to="/game" className="text-slate-400 hover:text-indigo-400 transition-colors">Game Mode</NavLink></li>
              <li><NavLink to="/forum" className="text-slate-400 hover:text-indigo-400 transition-colors">Discussions</NavLink></li>
              <li><NavLink to="/interview" className="text-slate-400 hover:text-indigo-400 transition-colors">Interview Practice</NavLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide">Contact</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#1e293b] border border-slate-700 flex items-center justify-center text-slate-400">
                  <Mail size={14} />
                </div>
                <a href="mailto:guptanchal009@gmail.com" className="text-slate-400 hover:text-white transition-colors">guptanchal009@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#1e293b] border border-slate-700 flex items-center justify-center text-slate-400">
                  <Phone size={14} />
                </div>
                <span className="text-slate-400">+91-9005672051</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#1e293b] border border-slate-700 flex items-center justify-center text-slate-400">
                  <MapPin size={14} />
                </div>
                <span className="text-slate-400">Uttar Pradesh, India</span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50 bg-[#060a14] py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} CodeOrbit. All rights reserved. Built with <span className="text-pink-500">❤️</span> for developers.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
