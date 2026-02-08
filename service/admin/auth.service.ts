import api from '@/service/axios.config';
import toast from 'react-hot-toast';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
  };
}

export interface VerifyTokenResponse {
  success: boolean;
  message: string;
  data?: {
    payload: {
      userId: string;
      email: string;
      role: string;
    };
  };
  timestamp?: string;
}

export const authService = {
  // Login for all roles
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.log('Sending login request with credentials:', { email: credentials.email, password: '***' });
      const response = await api.post('/auth/login', credentials) as LoginResponse;

      // Response is already processed by interceptor, so response is the data directly
      return response;
    } catch (error: any) {
      let errorMessage = 'Đăng nhập thất bại';
      // Try to extract message from the structured error response
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.data?.message) {
        errorMessage = error.response.data.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show toast error instead of throwing
      toast.error(errorMessage);

      // Return error response structure
      return {
        success: false,
        message: errorMessage
      };
    }
  },

  // Admin login (deprecated, use login instead)
  adminLogin: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return authService.login(credentials);
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      await api.post('/auth/logout');
      toast.success('Đăng xuất thành công');
      return { success: true, message: 'Đăng xuất thành công' };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng xuất thất bại';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },

  // Get current user profile
  getProfile: async (): Promise<any> => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể lấy thông tin người dùng';
      toast.error(errorMessage);
      return null;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<any> => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể làm mới token';
      toast.error(errorMessage);
      return null;
    }
  },

  // Verify token
  verifyToken: async (token: string): Promise<VerifyTokenResponse> => {
    try {
      const response = await api.post('/auth/verify', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Token không hợp lệ';
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  },
};
