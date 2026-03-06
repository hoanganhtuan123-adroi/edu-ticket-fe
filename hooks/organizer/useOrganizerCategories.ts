"use client";

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  organizerCategoryService, 
  FilterCategoryDto, 
  CategoryResponse, 
  CategoryListResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
  ApiResponse 
} from '@/service/organizer/category.service';

export interface UseOrganizerCategoriesState {
  categories: CategoryResponse[];
  category: CategoryResponse | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useOrganizerCategories = () => {
  const [state, setState] = useState<UseOrganizerCategoriesState>({
    categories: [],
    category: null,
    isLoading: false,
    error: null,
    pagination: {
      limit: 10,
      offset: 0,
      total: 0,
      hasNext: false,
      hasPrev: false,
    },
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Get all categories
  const getCategories = useCallback(async (filters: FilterCategoryDto = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<CategoryListResponse> = await organizerCategoryService.getCategories(filters);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          categories: response.data.data,
          pagination: response.data.pagination,
          isLoading: false,
        }));
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Lấy danh sách danh mục thất bại';
      setError(errorMessage);
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setLoading, setError]);

  // Get category by ID
  const getCategoryById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<CategoryResponse> = await organizerCategoryService.getCategoryById(id);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          category: response.data,
          isLoading: false,
        }));
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Lấy chi tiết danh mục thất bại';
      setError(errorMessage);
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, [setLoading, setError]);

  // Create category
  const createCategory = useCallback(async (categoryData: CreateCategoryDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<CategoryResponse> = await organizerCategoryService.createCategory(categoryData);
      
      if (response.success) {
        toast.success('Tạo danh mục thành công');
        setState(prev => ({
          ...prev,
          categories: [response.data, ...prev.categories],
          isLoading: false,
        }));
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Tạo danh mục thất bại';
      setError(errorMessage);
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, [setLoading, setError]);

  // Update category
  const updateCategory = useCallback(async (id: number, categoryData: UpdateCategoryDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<CategoryResponse> = await organizerCategoryService.updateCategory(id, categoryData);
      
      if (response.success) {
        toast.success('Cập nhật danh mục thành công');
        setState(prev => ({
          ...prev,
          categories: prev.categories.map(cat => 
            cat.id === id ? response.data : cat
          ),
          category: prev.category?.id === id ? response.data : prev.category,
          isLoading: false,
        }));
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Cập nhật danh mục thất bại';
      setError(errorMessage);
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, [setLoading, setError]);

  // Delete category
  const deleteCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<object> = await organizerCategoryService.deleteCategory(id);
      
      if (response.success) {
        toast.success('Xóa danh mục thành công');
        setState(prev => ({
          ...prev,
          categories: prev.categories.filter(cat => cat.id !== id),
          category: prev.category?.id === id ? null : prev.category,
          isLoading: false,
        }));
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Xóa danh mục thất bại';
      setError(errorMessage);
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, [setLoading, setError]);

  return {
    ...state,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  };
};
