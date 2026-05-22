import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { Star, Gift, Shield, Palette, Users, Shirt } from 'lucide-react';
import { checkAuth } from '../authSlice';

const iconMap = {
  Palette: <Palette size={40} className="text-secondary" />,
  Shield: <Shield size={40} className="text-accent" />,
  Users: <Users size={40} className="text-info" />,
  Shirt: <Shirt size={40} className="text-primary" />
};

const RedeemStore = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState('');

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

  const handlePurchase = async (itemId) => {
    if (!user) {
      setMessage('Please login to redeem items.');
      return;
    }
    
    try {
      setPurchasing(true);
      setMessage('');
      const { data } = await axiosClient.post('/redeem/purchase', {
        userId: user._id,
        itemId
      });
      setMessage(data.message);
      dispatch(checkAuth()); // Refresh user data to get updated points
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error making purchase.');
    } finally {
      setPurchasing(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-base-100 p-6 rounded-box shadow-lg mb-8 border border-base-content/10">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center">
            <Gift className="mr-2 text-primary" size={32}/> Redeem Store
          </h1>
          <p className="opacity-75 mt-2">Exchange your hard-earned points for exclusive rewards.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-base-200 p-4 rounded-xl shadow-inner text-center min-w-[150px]">
          <p className="text-sm font-bold opacity-70 uppercase tracking-widest">Your Balance</p>
          <div className="text-3xl font-black text-warning flex items-center justify-center gap-2 mt-1">
            <Star size={28} fill="currentColor" />
            {user?.points || 0}
          </div>
        </div>
      </div>

      {/* Toast Message */}
      {message && (
        <div className="toast toast-top toast-center z-50">
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} shadow-lg`}>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="card bg-base-100 shadow-xl border border-base-content/10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="card-body items-center text-center">
              <div className="p-4 bg-base-200 rounded-full mb-2">
                {iconMap[item.icon] || <Gift size={40} className="text-primary"/>}
              </div>
              <h2 className="card-title text-xl font-bold">{item.title}</h2>
              <p className="text-sm opacity-75 my-2 h-16">{item.description}</p>
              
              <div className="badge badge-warning badge-lg gap-2 font-bold mb-4">
                <Star size={16} fill="currentColor" /> {item.cost}
              </div>
              
              <div className="card-actions w-full">
                <button 
                  className="btn btn-primary w-full"
                  disabled={purchasing || (user && user.points < item.cost)}
                  onClick={() => handlePurchase(item.id)}
                >
                  {user && user.points < item.cost ? 'Need more points' : 'Redeem Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default RedeemStore;
