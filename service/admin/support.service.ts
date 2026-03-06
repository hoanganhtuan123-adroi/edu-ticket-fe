import api from '@/service/axios.config';
import { FilterSupportRequestDto } from '@/types/support.types';

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

export const supportService = {
  // Get admin support requests
  getAdminSupportRequests: async (
    filters?: FilterSupportRequestDto
  ) => {
    try {
      const token = getAdminToken();
      const params = new URLSearchParams();
      
      if (filters?.offset !== undefined) params.append('offset', filters.offset.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.title) params.append('title', filters.title);
      if (filters?.ticketCode) params.append('ticketCode', filters.ticketCode);
      
      const response = await api.get(`/supports/admin/list-request?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
     
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách yêu cầu hỗ trợ');
    }
  },

  // Get admin support request by ticket code
  getAdminRequestByTicketCode: async (ticketCode: string) => {
    try {
      const token = getAdminToken();
      const response = await api.get(`/supports/admin/ticket/${ticketCode}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết yêu cầu hỗ trợ');
    }
  },
};
