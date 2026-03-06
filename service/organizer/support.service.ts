import api from '@/service/axios.config';
import { 
  CreateSupportRequestDto, 
  SupportRequestResponseDto, 
  CreateSupportResponse,
  GetSupportRequestsResponse,
  FilterSupportRequestDto,
  GetSupportRequestDetailResponse
} from '@/types/support.types';

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

export const supportService = {
  // Create new support request
  createSupportRequest: async (
    supportData: CreateSupportRequestDto,
    files?: File[]
  ): Promise<CreateSupportResponse> => {
    try {
      const token = getOrganizerToken();
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add form fields
      formData.append('title', supportData.title);
      formData.append('description', supportData.description);
      
      if (supportData.eventId) {
        formData.append('eventId', supportData.eventId);
      }
      
      if (supportData.attachments && supportData.attachments.length > 0) {
        supportData.attachments.forEach((attachment, index) => {
          formData.append(`attachments[${index}]`, attachment);
        });
      }
      
      // Add files if provided
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`files`, file);
        });
      }
      
      const response = await api.post('/supports', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response as unknown as CreateSupportResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tạo yêu cầu hỗ trợ');
    }
  },

  // Get organizer's support requests
  getOrganizerSupportRequests: async (
    filters?: FilterSupportRequestDto
  ): Promise<GetSupportRequestsResponse> => {
    try {
      const token = getOrganizerToken();
      const params = new URLSearchParams();
      
      if (filters?.offset !== undefined) params.append('offset', filters.offset.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.title) params.append('title', filters.title);
      if (filters?.ticketCode) params.append('ticketCode', filters.ticketCode);
      
      const response = await api.get(`/supports/organizer/list-request?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      return response as unknown as GetSupportRequestsResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách yêu cầu hỗ trợ');
    }
  },

  // Get support request by ticket code
  getSupportRequestById: async (id: string): Promise<GetSupportRequestDetailResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get(`/supports/ticket/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      return response as unknown as GetSupportRequestDetailResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết yêu cầu hỗ trợ');
    }
  },
};
