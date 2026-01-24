import { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

// REMOVED: Audio import to fix the build error
// import notificationSound from '/assets/alert-sound.mp3'; 

const NotificationBell = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // 1. Fetch Initial Notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await apiClient.get('/notifications/my'); // Ensure backend route exists
      if (data && data.data) {
          setNotifications(data.data);
          setUnreadCount(data.data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. LISTEN FOR REAL-TIME ALERTS
  useEffect(() => {
    if (!socket) return;

    const handleNewAlert = (data) => {
      // A. Play Sound (Disabled until you add the file)
      // try { new Audio('/assets/alert-sound.mp3').play().catch(() => {}); } catch (e) {}

      // B. Show Toast
      toast((t) => (
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-bold text-gray-900">New Alert!</p>
            <p className="text-sm text-gray-600">{data.message}</p>
          </div>
        </div>
      ), { 
          duration: 5000, 
          position: 'top-right',
          style: {
            border: '1px solid #EAB308', // Yellow border for alert
            padding: '16px',
            color: '#713200',
          },
      });

      // C. Update State Locally (Optimistic UI)
      const newNotification = {
        _id: Date.now(), // Temp ID
        message: data.message,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.on('NEW_ALERT', handleNewAlert);

    return () => {
      socket.off('NEW_ALERT', handleNewAlert);
    };
  }, [socket]);

  // 3. Mark as Read Logic
  const handleMarkAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // API call
      await apiClient.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Failed to mark read");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50 focus:outline-none"
      >
        <FaBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Notifications</h3>
              {unreadCount > 0 && (
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                      {unreadCount} new
                  </span>
              )}
            </div>
            
            <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                    <FaBell size={32} className="mb-2 opacity-20" />
                    <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors relative ${!notif.isRead ? 'bg-blue-50/40' : ''}`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-blue-500 shadow-sm' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <p className={`text-sm leading-relaxed ${!notif.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1.5 font-medium">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
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

export default NotificationBell;