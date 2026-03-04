import api from '@/service/axios.config';

// Helper function to get organizer token from cookies
const getOrganizerToken = () => {
  if (typeof window === 'undefined') return null;
  
  // Get cookies from document
  const cookies = document.cookie.split(';');
  const organizerCookie = cookies.find(cookie => cookie.trim().startsWith('USER_ORGANIZER='));
  
  if (organizerCookie) {
    return organizerCookie.split('=')[1];
  }
  
  return null;
};

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target: 'user' | 'event' | 'global';
  isRead: boolean;
  isSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCount {
  count: number;
}

export const organizerNotificationService = {
  // Helper function to check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getOrganizerToken();
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<number> => {
    try {
      const token = getOrganizerToken();
      if (!token) {
        console.warn('User not authenticated, cannot get unread count');
        return 0;
      }
      const response: any = await api.get('/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data?.count || 0;
    } catch (error: any) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  },

  // Get my notifications
  getMyNotifications: async (): Promise<Notification[]> => {
    try {
      const token = getOrganizerToken();
      if (!token) {
        console.warn('User not authenticated, cannot get notifications');
        return [];
      }
      const response: any = await api.get('/notifications/my-notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data || [];
    } catch (error: any) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<void> => {
    try {
      const token = getOrganizerToken();
      if (!token) {
        throw new Error('User not authenticated');
      }
      await api.patch('/notifications/mark-as-read', 
        { notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể đánh dấu đã đọc');
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    try {
      const token = getOrganizerToken();
      if (!token) {
        throw new Error('User not authenticated');
      }
      await api.patch('/notifications/mark-all-as-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể đánh dấu tất cả đã đọc');
    }
  },

  // Delete notification
  deleteNotification: async (notificationId: number): Promise<void> => {
    try {
      const token = getOrganizerToken();
      if (!token) {
        throw new Error('User not authenticated');
      }
      await api.delete(`/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể xóa thông báo');
    }
  },

  // Delete all notifications
  clearAll: async (): Promise<void> => {
    try {
      const token = getOrganizerToken();
      if (!token) {
        throw new Error('User not authenticated');
      }
      await api.delete('/notifications/clear-all', {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể xóa tất cả thông báo');
    }
  },
};
