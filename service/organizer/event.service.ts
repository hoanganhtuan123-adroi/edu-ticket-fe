import api from '@/service/axios.config';
import { CreateEventDto, Event, Category } from '@/types/event.types';

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
      const response = await api.get('/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách danh mục');
    }
  },

  // Create new event (default status is DRAFT)
  createEvent: async (eventData: CreateEventDto): Promise<CreateEventResponse> => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tạo sự kiện');
    }
  },

  // Update event
  updateEvent: async (eventId: string, eventData: Partial<CreateEventDto>): Promise<CreateEventResponse> => {
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật sự kiện');
    }
  },

  // Get event by ID
  getEventById: async (eventId: string): Promise<CreateEventResponse> => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin sự kiện');
    }
  },

  // Submit event for approval
  submitForApproval: async (eventId: string): Promise<SubmitForApprovalResponse> => {
    try {
      const response = await api.post(`/events/${eventId}/submit-for-approval`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể gửi sự kiện để phê duyệt');
    }
  },

  // Get organizer's events
  getMyEvents: async (page = 1, limit = 10): Promise<any> => {
    try {
      const response = await api.get(`/events/my-events?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sự kiện');
    }
  },
};
