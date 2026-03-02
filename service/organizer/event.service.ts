import api from '@/service/axios.config';
import { CreateEventDto, Event, Category, EventDetailResponse } from '@/types/event.types';

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

export interface CreateEventResponse {
  success: boolean;
  message: string;
  data?: Event; // Direct Event object, not wrapped in "event"
}

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data?: {
    categories: Category[];
  };
}

export interface SubmitForApprovalResponse {
  success: boolean;
  message: string;
  data?: { 
    id: string; 
    title: string; 
    status: string; 
  };
  timestamp?: string;
}

export const eventService = {
  // Get all categories
  getCategories: async (): Promise<GetCategoriesResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get('/categories', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as GetCategoriesResponse; // Axios interceptor already returns response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách danh mục');
    }
  },

  // Create new event (default status is DRAFT)
  createEvent: async (eventData: CreateEventDto | FormData): Promise<any> => {
    try {
      const token = getOrganizerToken();
      const response = await api.post('/events/create', eventData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Đảm bảo có cái này hoặc để trống để tự nhận diện
        },
      });
      return response; // Axios interceptor already returns response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tạo sự kiện');
    }
  },

  // Update event
  updateEvent: async (eventId: string, eventData: Partial<CreateEventDto>): Promise<CreateEventResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.put(`/events/${eventId}`, eventData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as CreateEventResponse; // Axios interceptor already returns response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật sự kiện');
    }
  },

  // Get event detail for organizer
  getEventDetailForOrganizer: async (slug: string): Promise<EventDetailResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get(`/events/organizer/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as EventDetailResponse; // Axios interceptor already returns response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết sự kiện');
    }
  },

  // Submit event for approval
  submitForApproval: async (slug: string): Promise<SubmitForApprovalResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.patch(`/events/${slug}/submit-for-approval`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as SubmitForApprovalResponse; // Axios interceptor already returns response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể gửi sự kiện để phê duyệt');
    }
  },

  // Resubmit event for approval (for rejected events)
  resubmitEventForApproval: async (slug: string): Promise<SubmitForApprovalResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.patch(`/events/${slug}/resubmit`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response as unknown as SubmitForApprovalResponse; // Axios interceptor already returns response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể gửi lại sự kiện để phê duyệt');
    }
  },

  // Get organizer's events
  getMyEvents: async (filters?: { limit?: number; offset?: number; title?: string; location?: string; status?: string; categoryId?: string }): Promise<any> => {
    try {
      const token = getOrganizerToken();
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      if (filters?.title) params.append('title', filters.title);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
      
      const response = await api.get(`/events/organizer-events?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sự kiện');
    }
  },
};
