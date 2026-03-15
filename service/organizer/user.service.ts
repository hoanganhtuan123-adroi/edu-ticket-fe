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

export enum SystemRole {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  USER = 'USER',
}

export interface FilterUserDto {
  email?: string;
  studentCode?: string;
  role?: SystemRole;
  faculty?: string;
  limit?: number;
  offset?: number;
}

export interface UserResponse {
  id: string;
  email: string;
  systemRole: SystemRole;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  studentCode?: string;
  faculty?: string;
}

export interface UserDetailResponse {
  id: string;
  email: string;
  systemRole: SystemRole;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  studentCode?: string;
  faculty?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  total: number;
  limit: number;
  offset: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const organizerUserService = {
  // Get all users with filters
  getAllUsers: async (filters: FilterUserDto): Promise<any> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get('/users/list-users', {
        params: filters,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lấy danh sách người dùng thất bại');
    }
  },
};
