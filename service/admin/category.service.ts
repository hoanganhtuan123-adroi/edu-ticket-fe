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

// Validation schema
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống').max(100, 'Tên danh mục không được vượt quá 100 ký tự'),
  description: z.string().optional()
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống').max(100, 'Tên danh mục không được vượt quá 100 ký tự'),
  description: z.string().optional()
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;

export interface FilterCategoryDto {
  name?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryListResponse {
  data: CategoryResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const categoryService = {
  // Get all categories with filters
  getCategories: async (filters: FilterCategoryDto): Promise<ApiResponse<CategoryListResponse>> => {
    try {
      const token = getAdminToken();
      const response: ApiResponse<CategoryListResponse> = await api.get('/categories', { 
        params: filters,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lấy danh sách danh mục thất bại');
    }
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<ApiResponse<CategoryResponse>> => {
    try {
      const token = getAdminToken();
      const response: ApiResponse<CategoryResponse> = await api.get(`/categories/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lấy chi tiết danh mục thất bại');
    }
  },

  // Create category
  createCategory: async (categoryData: CreateCategoryDto): Promise<ApiResponse<CategoryResponse>> => {
    try {
      const token = getAdminToken();
      const response: ApiResponse<CategoryResponse> = await api.post('/categories/create', categoryData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Tạo danh mục thất bại');
    }
  },

  // Update category
  updateCategory: async (id: number, categoryData: UpdateCategoryDto): Promise<ApiResponse<CategoryResponse>> => {
    try {
      const token = getAdminToken();
      const response: ApiResponse<CategoryResponse> = await api.patch(`/categories/${id}`, categoryData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Cập nhật danh mục thất bại');
    }
  },

  // Delete category
  deleteCategory: async (id: number): Promise<ApiResponse<object>> => {
    try {
      const token = getAdminToken();
      const response: ApiResponse<object> = await api.delete(`/categories/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Xóa danh mục thất bại');
    }
  },
};
