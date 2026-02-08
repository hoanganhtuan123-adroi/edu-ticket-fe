import api from '@/service/axios.config';
import { CreateEventDto, Event, Category } from '@/types/event.types';

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
  data?: {
    event: Event;
  };
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
    event: Event;
  };
}

export const eventService = {
  // Get all categories
  getCategories: async (): Promise<GetCategoriesResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get('/categories', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách danh mục');
    }
  },

  // Create new event (default status is DRAFT)
  createEvent: async (eventData: CreateEventDto | FormData): Promise<CreateEventResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.post('/events/create', eventData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        // Don't set Content-Type for FormData - let browser set it with boundary
      });
      return response.data;
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
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật sự kiện');
    }
  },

  // Get event by ID
  getEventById: async (eventId: string): Promise<CreateEventResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get(`/events/${eventId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin sự kiện');
    }
  },

  // Submit event for approval
  submitForApproval: async (eventId: string): Promise<SubmitForApprovalResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.post(`/events/${eventId}/submit-for-approval`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể gửi sự kiện để phê duyệt');
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
      
      const response = await api.get(`/events/my-events?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sự kiện');
    }
  },
};
