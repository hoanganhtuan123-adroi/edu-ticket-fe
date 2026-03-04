import { useState, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { organizerNotificationService, Notification } from '@/service/organizer/notification.service';
import { useSocket } from '../useSocket';

export const useOrganizerNotifications = () => {
  const { connected, onNotification, onUnreadCountUpdated } = useSocket();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Use ref to store callbacks to avoid stale closure issues
  const callbacksRef = useRef({
    getUnreadCount: async () => {},
    getNotifications: async () => {}
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all notifications
  const getNotifications = useCallback(async () => {
    // Check authentication before making API call
    if (!organizerNotificationService.isAuthenticated()) {
      console.warn('User not authenticated, skipping notification fetch');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await organizerNotificationService.getMyNotifications();
      setNotifications(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy danh sách thông báo';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const getUnreadCount = useCallback(async () => {
    // Check authentication before making API call
    if (!organizerNotificationService.isAuthenticated()) {
      console.warn('User not authenticated, skipping unread count fetch');
      return;
    }

    try {
      const count = await organizerNotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err: any) {
      console.error('Failed to get unread count:', err);
    }
  }, []);

  // Update ref whenever callbacks change
  useEffect(() => {
    callbacksRef.current.getNotifications = getNotifications;
    callbacksRef.current.getUnreadCount = getUnreadCount;
  }, [getNotifications, getUnreadCount]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      await organizerNotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể đánh dấu đã đọc';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await organizerNotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể đánh dấu tất cả đã đọc';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: number) => {
    try {
      await organizerNotificationService.deleteNotification(id);
      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success('Đã xóa thông báo');
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể xóa thông báo';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [notifications]);

  // Delete all notifications
  const clearAll = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all(notifications.map(n => organizerNotificationService.deleteNotification(n.id)));
      setNotifications([]);
      setUnreadCount(0);
      toast.success('Đã xóa tất cả thông báo');
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể xóa tất cả thông báo';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  // Listen to socket for unread count updates - direct from server
  useEffect(() => {
    if (!connected) return;

    const unsubscribeUnreadCount = onUnreadCountUpdated((data: { count: number }) => {
      console.log('🔔 Socket unread count updated:', data.count);
      setUnreadCount(data.count);
    });

    return () => {
      unsubscribeUnreadCount();
    };
  }, [connected, onUnreadCountUpdated]);

  // Listen to socket for new notifications - stable subscription
  useEffect(() => {
    if (!connected) return;

    const unsubscribeNotification = onNotification((data: unknown) => {
      console.log('🔔 Socket notification received:', data);
      const notificationData = data as Notification;
      
      // Add new notification to list
      setNotifications((prev) => [notificationData, ...prev]);
      
      // Note: unread count will be updated via unreadCountUpdated event from server
    });

    return () => {
      unsubscribeNotification();
    };
  }, [connected, onNotification]);

  // Initial fetch
  useEffect(() => {
    getNotifications();
    getUnreadCount();
  }, [getNotifications, getUnreadCount]);

  return {
    loading,
    error,
    clearError,
    notifications,
    unreadCount,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    connected,
  };
};
