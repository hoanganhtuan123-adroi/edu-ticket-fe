import { useState, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { adminNotificationService, PaginatedNotifications } from '@/service/admin/notification.service';
import { useSocket } from '../useSocket';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  readAt?: Date;
  isEmailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

export const useAdminNotifications = () => {
  const { connected, onNotification, onUnreadCountUpdated } = useSocket();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  
  // Use ref to store callbacks to avoid stale closure issues
  const callbacksRef = useRef({
    getUnreadCount: async () => {},
    getNotifications: async () => {}
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all notifications
  const getNotifications = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (page - 1) * pagination.itemsPerPage;
      // Always call API with limit and offset
      const response: PaginatedNotifications = await adminNotificationService.getMyNotifications({
        limit: pagination.itemsPerPage,
        offset,
      });
      setNotifications(response.data);
      
      // Calculate pagination values from API response
      const totalPages = Math.ceil(response.pagination.total / response.pagination.limit);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.max(1, totalPages),
        totalItems: response.pagination.total,
      }));
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy danh sách thông báo';
      setError(errorMessage);
      console.error(errorMessage);
      // Set default pagination on error
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.max(1, prev.totalPages),
      }));
    } finally {
      setLoading(false);
    }
  }, [pagination.itemsPerPage]);

  // Fetch unread count
  const getUnreadCount = useCallback(async () => {
    try {
      const count = await adminNotificationService.getUnreadCount();
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
      await adminNotificationService.markAsRead(id);
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
      await adminNotificationService.markAllAsRead();
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
      await adminNotificationService.deleteNotification(id);
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
      await Promise.all(notifications.map(n => adminNotificationService.deleteNotification(n.id)));
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

  // Send notification (admin only)
  const sendNotification = useCallback(async (data: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    sendWeb?: boolean;
    sendEmail?: boolean;
    metadata?: any;
  }) => {
    try {
      const notification = await adminNotificationService.sendNotification(data);
      toast.success('Đã gửi thông báo thành công');
      return notification;
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể gửi thông báo';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Listen to socket for unread count updates - direct from server
  useEffect(() => {
    if (!connected) return;

    const unsubscribeUnreadCount = onUnreadCountUpdated((data: { count: number }) => {
      console.log('� Socket unread count updated:', data.count);
      setUnreadCount(data.count);
    });

    return () => {
      unsubscribeUnreadCount();
    };
  }, [connected, onUnreadCountUpdated]);

  // Listen to socket for new notifications - stable subscription
  useEffect(() => {
    console.log('🔔 Setting up notification listeners, connected:', connected);
    if (!connected) return;

    const unsubscribeNotification = onNotification((data: unknown) => {
      console.log('🔔 Socket notification received:', data);
      const notificationData = data as Notification;
      
      // Add new notification to list
      setNotifications((prev) => [notificationData, ...prev]);
      
      // Also increment unread count immediately for better UX
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      unsubscribeNotification();
    };
  }, [connected, onNotification]);

  // Handle page change
  const handlePageChange = useCallback(async (page: number) => {
    await getNotifications(page);
  }, [getNotifications]);

  // Initial fetch
  useEffect(() => {
    getNotifications(1);
    getUnreadCount();
  }, [getNotifications, getUnreadCount]);

  return {
    loading,
    error,
    clearError,
    notifications,
    unreadCount,
    pagination,
    getNotifications,
    getUnreadCount,
    handlePageChange,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    sendNotification,
    connected,
  };
};
