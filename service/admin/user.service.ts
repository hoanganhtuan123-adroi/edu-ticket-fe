import api from '@/service/axios.config';
import { z } from 'zod';

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

export enum SystemRole {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  USER = 'USER',
}

export const createUserSchema = z.object({
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  phoneNumber: z.string().min(1, 'Số điện thoại không được để trống').regex(/^[0-9]{10,11}$/, 'Số điện thoại không đúng định dạng'),
  role: z.nativeEnum(SystemRole),
  faculty: z.string().optional(),
  studentCode: z.string().optional(),
}).refine((data) => {
  if (data.role === SystemRole.ORGANIZER) {
    return data.faculty !== undefined && data.faculty.trim().length > 0;
  }
  return true;
}, {
  message: 'Khoa không được để trống đối với Ban tổ chức',
  path: ['faculty'],
}).refine((data) => {
  if (data.role === SystemRole.USER) {
    return data.studentCode !== undefined && data.studentCode.trim().length > 0;
  }
  return true;
}, {
  message: 'Mã sinh viên không được để trống đối với Người dùng',
  path: ['studentCode'],
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export interface FilterUserDto {
  email?: string;
  studentCode?: string;
  role?: SystemRole;
  faculty?: string;
  limit?: number;
  offset?: number;
}

export interface UserResponse {
  id: string; // Changed from number to string to match API response
  email: string;
  systemRole: SystemRole;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
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

export const userService = {
  // Create user
  createUser: async (userData: CreateUserDto): Promise<ApiResponse<object>> => {
    try {
      const token = getAdminToken();
      const response = await api.post('/users/create', userData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Tạo người dùng thất bại');
    }
  },

  // Get all users with filters
  getAllUsers: async (filters: FilterUserDto): Promise<any> => {
    try {
      const token = getAdminToken();
      const response = await api.get('/users/list-users', {
        params: filters,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lấy danh sách người dùng thất bại');
    }
  },

  // Get user detail
  getUserDetail: async (id: string): Promise<ApiResponse<UserDetailResponse>> => {
    try {
      const token = getAdminToken();
      const response: ApiResponse<UserDetailResponse> = await api.get(`/users/${id}/detail`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lấy chi tiết người dùng thất bại');
    }
  },

  // Update user
  updateUser: async (id: string, userData: Partial<CreateUserDto>): Promise<ApiResponse<any>> => {
    try {
      const token = getAdminToken();
      const response: ApiResponse<any> = await api.patch(`/users/update/${id}`, userData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.message || 'Cập nhật người dùng thất bại');
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse<object>> => {
    try {
      const token = getAdminToken();
      const response = await api.delete(`/users/delete/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Xóa người dùng thất bại');
    }
  },
};
