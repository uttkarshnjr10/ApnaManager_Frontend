// src/hooks/useNotifications.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing real-time notifications
 * Handles fetching, socket updates, and read/unread state
 */
export const useNotifications = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async () => {
    const controller = new AbortController();
    
    try {
      setIsLoading(true);
      const { data } = await apiClient.get('/notifications/my', {
        signal: controller.signal
      });
      
      if (data && data.data && isMountedRef.current) {
        setNotifications(data.data);
        setUnreadCount(data.data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error("Failed to fetch notifications", error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }

    return () => controller.abort();
  }, []);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // API call
      await apiClient.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Rollback on error
      fetchNotifications();
    }
  }, [fetchNotifications]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.isRead)
        .map(n => n._id);

      if (unreadIds.length === 0) return;

      // Optimistic update
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);

      // API calls in parallel
      await Promise.all(
        unreadIds.map(id => apiClient.put(`/notifications/${id}/read`))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      fetchNotifications();
    }
  }, [notifications, fetchNotifications]);

  /**
   * Handle incoming socket alert
   */
  const handleNewAlert = useCallback((data) => {
    // Play notification sound (optional)
    // try { new Audio('/assets/alert-sound.mp3').play().catch(() => {}); } catch (e) {}

    // Show toast notification
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
          border: '1px solid #EAB308',
          padding: '16px',
          color: '#713200',
        },
    });

    // Update state with new notification
    const newNotification = {
      _id: `temp_${Date.now()}`, // Temp ID until refresh
      message: data.message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchNotifications]);

  // Socket listener setup
  useEffect(() => {
    if (!socket) return;

    socket.on('NEW_ALERT', handleNewAlert);

    // Cleanup listener on unmount or socket change
    return () => {
      socket.off('NEW_ALERT', handleNewAlert);
    };
  }, [socket, handleNewAlert]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};