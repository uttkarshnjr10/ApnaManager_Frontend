// src/components/ui/NotificationBell.jsx
import { useState, useRef, useEffect } from 'react';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../hooks/useNotifications';

const Motion = motion;

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif._id);
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllAsRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label="Notifications"
      >
        <FaBell size={18} />
        {unreadCount > 0 && (
          <Motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold leading-none text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-white p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  <FaCheckDouble size={12} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-slate-400">
                  <FaBell size={36} className="mb-3 opacity-30" />
                  <p className="text-sm font-medium text-slate-500">No notifications yet</p>
                  <p className="mt-1 text-xs text-slate-400">You're all caught up.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <Motion.div
                    key={notif._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleNotificationClick(notif)}
                    className={`group relative cursor-pointer border-b border-slate-50 p-4 transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full transition-colors ${!notif.isRead ? 'bg-blue-500' : 'bg-slate-200 opacity-0 group-hover:opacity-100'}`} />

                      <div className="min-w-0 flex-1">
                        <p className={`break-words text-sm leading-relaxed ${!notif.isRead ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                          {notif.message}
                        </p>
                        <p className="mt-1.5 text-xs font-medium text-slate-400">
                          {formatTimestamp(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Motion.div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50 p-3 text-center">
                <button
                  className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </button>
              </div>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const formatTimestamp = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMs = now - time;
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return time.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    ...(now.getFullYear() !== time.getFullYear() && { year: 'numeric' }),
  });
};

export default NotificationBell;
