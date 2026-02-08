import api from '@/app/service/axios.config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  };
}

export const authService = {
  // Admin login
  adminLogin: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      // Clear token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    } catch (error: any) {
      // Even if API call fails, clear local token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      throw new Error(error.response?.data?.message || 'Đăng xuất thất bại');
    }
  },

  // Get current user profile
  getProfile: async (): Promise<any> => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
  },

  // Refresh token
  refreshToken: async (): Promise<any> => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể làm mới token');
    }
  },
};
