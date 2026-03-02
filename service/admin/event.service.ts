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

export interface AdminEventDetail {
  id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  location: string;
  startTime: string;
  endTime: string;
  status: string;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  category?: {
    name: string;
    description?: string;
  };
  organizer?: {
    fullName?: string;
    email: string;
  };
  ticketTypes?: {
    name: string;
    type: string;
    price: string;
    quantityLimit: number;
    soldQuantity: number;
    startSaleTime?: string;
    endSaleTime?: string;
    description?: string;
  }[];
  approvalHistory?: {
    id: string;
    action: string;
    reason?: string;
    createdAt: string;
    admin: {
      fullName?: string;
      email: string;
    };
  }[];
  attachments?: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
  }[];
}

export interface AdminEvent {
  id: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  organizer: {
    fullName?: string;
    email: string;
  };
  category: {
    name: string;
  };
}

export interface AdminEventFilter {
  limit?: number;
  offset?: number;
  title?: string;
  location?: string;
  status?: string;
  categoryId?: string;
}

export interface AdminEventResponse {
  success: boolean;
  message: string;
  data: {
    data: AdminEvent[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export const adminEventService = {
  // Get event by ID
  getEventById: async (eventId: string): Promise<AdminEventDetail> => {
    try {
      const token = getAdminToken();
      const response = await api.get(`/events/${eventId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data; // The interceptor already returns response.data, so we just need response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết sự kiện');
    }
  },

  // Approve event
  approveEvent: async (eventId: string): Promise<any> => {
    try {
      const token = getAdminToken();
      const response = await api.patch(`/events/${eventId}/approve`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể phê duyệt sự kiện');
    }
  },

  // Reject event
  rejectEvent: async (eventId: string, reason?: string): Promise<any> => {
    try {
      const token = getAdminToken();
      const response = await api.patch(`/events/${eventId}/reject`, { reason }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể từ chối sự kiện');
    }
  },

  // Get all events for admin
  getAllEvents: async (filters: AdminEventFilter = {}): Promise<AdminEventResponse> => {
    try {
      const token = getAdminToken();
      const params = new URLSearchParams();
      
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
      if (filters.title) params.append('title', filters.title);
      if (filters.location) params.append('location', filters.location);
      if (filters.status) params.append('status', filters.status);
      if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
      
      const response = await api.get(`/events?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as AdminEventResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sự kiện');
    }
  },
};
