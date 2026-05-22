import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, MessageSquare, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../utils/axiosClient';

const NotificationDropdown = () => {
  const { user } = useSelector(state => state.auth);
  const navigate  = useNavigate();
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  /* ── Close on outside click ── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Socket + initial fetch ── */
  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const socket = io('http://localhost:3000', { withCredentials: true });
    socket.on('connect', () => socket.emit('join_room', String(user._id)));
    socket.on('notification', (n) => setNotifications(prev => [n, ...prev]));

    return () => socket.close();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosClient.get('/forum/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosClient.put('/forum/notifications/read');
      setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleClick = (notif) => {
    setIsOpen(false);
    setNotifications(ns => ns.map(n => n._id === notif._id ? { ...n, isRead: true } : n));

    if (notif.targetModel === 'DiscussionPost') {
      navigate(`/forum/post/${notif.targetId}`);
    } else {
      navigate('/forum');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'reply':            return <MessageSquare size={14} className="text-blue-400" />;
      case 'upvote_post':
      case 'upvote_comment':   return <ThumbsUp size={14} className="text-emerald-400" />;
      case 'accepted_answer':  return <CheckCircle size={14} className="text-emerald-400" />;
      default:                 return <Bell size={14} className="text-slate-400" />;
    }
  };

  const getText = (notif) => {
    const sender = `${notif.senderId?.firstName ?? ''} ${notif.senderId?.lastName ?? ''}`.trim() || 'Someone';
    switch (notif.type) {
      case 'reply':           return <><span className="font-bold text-slate-200">{sender}</span> replied to your post</>;
      case 'upvote_post':     return <><span className="font-bold text-slate-200">{sender}</span> upvoted your post</>;
      case 'upvote_comment':  return <><span className="font-bold text-slate-200">{sender}</span> upvoted your comment</>;
      case 'accepted_answer': return <><span className="font-bold text-slate-200">{sender}</span> accepted your answer</>;
      default:                return 'New notification';
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-[#0f172a]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-[#1e293b]/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between bg-[#0f172a]/60">
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <Bell size={24} className="mx-auto mb-2 text-slate-600" />
                  <p className="text-sm text-slate-500">No notifications yet.</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif._id}
                    onClick={() => handleClick(notif)}
                    className={`flex items-start gap-3 px-4 py-3.5 border-b border-slate-700/30 hover:bg-[#0f172a]/60 cursor-pointer transition-colors ${
                      !notif.isRead ? 'bg-indigo-500/5' : ''
                    }`}
                  >
                    <div className="mt-0.5 bg-slate-800 border border-slate-700 p-1.5 rounded-full shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 leading-snug">{getText(notif)}</p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
