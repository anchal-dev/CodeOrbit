import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axiosClient from '../utils/axiosClient';
import { MessageCircle, Send, X, Minus } from 'lucide-react';

// Lazy socket — created with autoConnect:false so it doesn't spam
// ERR_CONNECTION_REFUSED when the backend is not running or page loads.
let socket = null;
const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      withCredentials: true,
      autoConnect: false,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

const ChatBox = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const room = 'global';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const s = getSocket();
      if (!s.connected) s.connect();
      axiosClient.get(`/chat/${room}`).then(({ data }) => {
        setMessages(data);
      }).catch(() => {});
      s.emit('join_room', room);
    }
  }, [isOpen]);

  useEffect(() => {
    const s = getSocket();
    const receiveMessageHandler = (data) => {
      if (data.room === room) {
        setMessages((prev) => [...prev, data]);
      }
    };
    s.on('receive_message', receiveMessageHandler);
    return () => s.off('receive_message', receiveMessageHandler);
  }, []);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized, isOpen]);

  const sendMessage = async () => {
    if (currentMessage.trim() && user) {
      const messageData = {
        room,
        sender: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar
        },
        content: currentMessage,
        createdAt: new Date().toISOString()
      };
      const s = getSocket();
      if (!s.connected) s.connect();
      await s.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setCurrentMessage('');
    }
  };

  if (!user) return null; // Don't show chat to guests

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 btn btn-circle btn-primary btn-lg shadow-2xl animate-bounce"
        style={{ zIndex: 9999 }}
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className={`fixed right-6 bottom-0 w-80 bg-base-100 rounded-t-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-96'}`} style={{ zIndex: 9999, border: '1px solid var(--fallback-bc,oklch(var(--bc)/0.2))' }}>
      
      {/* Chat Header */}
      <div 
        className="bg-primary text-primary-content p-3 rounded-t-xl flex justify-between items-center cursor-pointer select-none"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="font-bold flex items-center gap-2">
          <MessageCircle size={18} /> Global Chat
        </div>
        <div className="flex gap-1">
          <button className="btn btn-xs btn-circle btn-ghost" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
            <Minus size={14} />
          </button>
          <button className="btn btn-xs btn-circle btn-ghost text-error" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 bg-base-200 space-y-4">
            {messages.map((msg, index) => {
              const isMe = msg.sender?._id === user._id || msg.sender === user._id;
              return (
                <div key={index} className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
                  <div className="chat-image avatar">
                    <div className="w-8 rounded-full ring ring-primary/20">
                      <img src={msg.sender?.avatar || `https://ui-avatars.com/api/?name=${msg.sender?.firstName || 'A'}+${msg.sender?.lastName || 'U'}&background=random`} alt="avatar" />
                    </div>
                  </div>
                  <div className="chat-header text-xs opacity-50 mb-1">
                    {isMe ? 'You' : `${msg.sender?.firstName} ${msg.sender?.lastName}`}
                  </div>
                  <div className={`chat-bubble text-sm ${isMe ? 'chat-bubble-primary' : 'chat-bubble-neutral'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-base-100 border-t border-base-content/10">
            <div className="join w-full">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="input input-bordered input-sm join-item w-full focus:outline-primary"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                className="btn btn-sm btn-primary join-item"
                onClick={sendMessage}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
