import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../utils/axiosClient';
import { Star, Gift, Shield, Palette, Users, Shirt, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { checkAuth } from '../authSlice';

const iconMap = {
  Palette: <Palette size={32} className="text-pink-400 animate-pulse" />,
  Shield: <Shield size={32} className="text-cyan-400" />,
  Users: <Users size={32} className="text-emerald-400" />,
  Shirt: <Shirt size={32} className="text-indigo-400" />
};

const RedeemStore = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axiosClient.get('/redeem/items');
        setItems(data);
      } catch (error) {
        console.error('Error fetching store items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handlePurchase = async (itemId) => {
    if (!user) {
      triggerToast('Please login to redeem items.', 'error');
      return;
    }
    
    try {
      setPurchasingId(itemId);
      const { data } = await axiosClient.post('/redeem/purchase', {
        userId: user._id,
        itemId
      });
      triggerToast(data.message || 'Item redeemed successfully!', 'success');
      dispatch(checkAuth()); // Refresh user data points
    } catch (error) {
      triggerToast(error.response?.data?.message || 'Error making purchase.', 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d18] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Entering the Store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100 pb-20 pt-24 font-sans relative overflow-hidden">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0f172a]/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Gift size={20} />
              </div>
              <h1 className="text-3xl font-black text-white">Redeem Store</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Exchange the Orbit points you earned from solving DSA problems, quizzes, and mock interviews for exclusive rewards.
            </p>
          </div>

          <div className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl text-center min-w-[200px] flex flex-col items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Available Balance</span>
            <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-2 mt-1">
              <span className="relative flex h-3 w-3 self-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              🪙 {user?.points || 0}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl"
              style={{
                backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                borderColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                color: toast.type === 'success' ? '#34d399' : '#f87171'
              }}
            >
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Store items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => {
            const hasEnoughPoints = user && user.points >= item.cost;
            const isPurchasing = purchasingId === item.id;

            return (
              <div 
                key={item.id} 
                className="bg-[#0f172a]/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/50 hover:bg-[#0f172a]/80 transition-all duration-300 transform hover:-translate-y-1 shadow-xl group"
              >
                <div className="space-y-4">
                  {/* Icon Block */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {iconMap[item.icon] || <Gift size={32} className="text-purple-400" />}
                  </div>

                  {/* Text Description */}
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed min-h-[48px] line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-xl text-xs">
                    🪙 {item.cost} Points
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(item.id)}
                  disabled={isPurchasing || !hasEnoughPoints}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 mt-6 ${
                    isPurchasing
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : !hasEnoughPoints
                      ? 'bg-slate-900/80 border border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white shadow-lg shadow-purple-600/20'
                  }`}
                >
                  {isPurchasing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                      Redeeming...
                    </span>
                  ) : !hasEnoughPoints ? (
                    'Need More Points'
                  ) : (
                    'Redeem Now'
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default RedeemStore;
