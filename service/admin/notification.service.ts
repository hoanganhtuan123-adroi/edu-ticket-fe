import api from '@/service/axios.config';

// Helper function to get admin token from cookies
const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  
  // Get cookies from document
  const cookies = document.cookie.split(';');
  const adminCookie = cookies.find(cookie => cookie.trim().startsWith('USER_ADMIN='));
  
  if (adminCookie) {
    return adminCookie.split('=')[1];
  }
  
  return null;
};

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

export interface PaginatedNotifications {
  data: Notification[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface NotificationCount {
  count: number;
}

export const adminNotificationService = {
  // Get unread notification count
  getUnreadCount: async (): Promise<number> => {
    try {
      const token = getAdminToken();
      const response: any = await api.get('/notifications/unread-count', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data?.count || 0;
    } catch (error: any) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  },

  // Get my notifications
  getMyNotifications: async (filters?: {
    limit?: number;
    offset?: number;
    isRead?: boolean;
    type?: string;
  }): Promise<PaginatedNotifications> => {
    try {
      const token = getAdminToken();
      const params = new URLSearchParams();
      
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString());
      if (filters?.type) params.append('type', filters.type);
      
      const response: any = await api.get(`/notifications/my-notifications?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      // Handle paginated response
      if (response.data?.data && response.data?.pagination) {
        return response.data;
      }
      
      // Fallback: create pagination structure from array response
      const data = response.data || [];
      const itemsPerPage = filters?.limit || 10;
      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const currentPage = Math.floor((filters?.offset || 0) / itemsPerPage) + 1;
      
      return {
        data,
        pagination: {
          limit: itemsPerPage,
          offset: filters?.offset || 0,
          total: totalItems,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1,
        },
      };
    } catch (error: any) {
      console.error('Failed to get notifications:', error);
      return {
        data: [],
        pagination: {
          limit: 10,
          offset: 0,
          total: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<void> => {
    try {
      const token = getAdminToken();
      await api.patch('/notifications/mark-as-read', 
        { notificationId },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể đánh dấu đã đọc');
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    try {
      const token = getAdminToken();
      await api.patch('/notifications/mark-all-as-read', {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể đánh dấu tất cả đã đọc');
    }
  },

  // Delete notification
  deleteNotification: async (notificationId: number): Promise<void> => {
    try {
      const token = getAdminToken();
      await api.delete(`/notifications/${notificationId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể xóa thông báo');
    }
  },

  // Send notification (for admin only)
  sendNotification: async (data: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    sendWeb?: boolean;
    sendEmail?: boolean;
    metadata?: any;
  }): Promise<Notification> => {
    try {
      const token = getAdminToken();
      const response: any = await api.post('/notifications/send', data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể gửi thông báo');
    }
  },
};
