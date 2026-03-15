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

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    data: Array<{
      id: string;
      fullName: string;
      studentCode: string;
      bookingStatus: string;
      bookingTime: string;
    }>;
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  timestamp?: string;
}

export interface ApproveRegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp?: string;
}

export interface RegistrationStatsResponse {
  success: boolean;
  message: string;
  data?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    approvalRate: number;
  };
  timestamp?: string;
}

export const registrationService = {
  // Get event registrations by event slug
  getEventRegistrations: async (eventSlug: string, filters?: { 
    limit?: number; 
    offset?: number; 
    title?: string; 
    status?: string 
  }): Promise<RegistrationResponse> => {
    try {
      const token = getOrganizerToken();
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.title) params.append('title', filters.title);
      if (filters?.status) params.append('status', filters.status);
      
      const response = await api.get(`/events/${eventSlug}/organizer-event-registers?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as RegistrationResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách đăng ký');
    }
  },

  // Get event registration statistics
  getEventRegistrationStats: async (eventSlug: string): Promise<RegistrationStatsResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get(`/events/${eventSlug}/registration-stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as RegistrationStatsResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thống kê đăng ký');
    }
  },

  // Get registration details
  getRegistrationDetails: async (registrationId: string): Promise<any> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get(`/events/registrations/${registrationId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết đăng ký');
    }
  },

  // Approve registration
  approveRegistration: async (bookingCode: string): Promise<ApproveRegistrationResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.put(`/booking/approve`, { bookingCode }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as ApproveRegistrationResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể duyệt đăng ký');
    }
  },

  // Reject registration
  rejectRegistration: async (bookingCode: string, reason?: string): Promise<ApproveRegistrationResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.put(`/booking/reject`, { bookingCode, reason }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as ApproveRegistrationResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể từ chối đăng ký');
    }
  },

};
