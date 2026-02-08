"use client";

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  categoryService, 
  FilterCategoryDto, 
  CategoryResponse, 
  CategoryListResponse,
  ApiResponse 
} from '@/service/admin/category.service';

interface UseCategoryReturn {
  categories: CategoryResponse[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  itemsPerPage: number;
  pagination: {
    data: CategoryResponse[];
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
  } | null;
  filters: FilterCategoryDto;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<FilterCategoryDto>) => void;
  handlePageChange: (newOffset: number) => void;
  fetchCategories: () => void;
  createCategory: (data: any) => Promise<boolean>;
  updateCategory: (id: number, data: any) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  refreshCategories: () => void;
  clearError: () => void;
}

export const useCategory = (initialFilters?: FilterCategoryDto): UseCategoryReturn => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<{
    data: CategoryResponse[];
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
  } | null>(null);
  const [filters, setFiltersState] = useState<FilterCategoryDto>({
    limit: 10,
    offset: 0,
    ...initialFilters
  });
  const [error, setError] = useState<string | null>(null);

  // Calculate derived pagination values
  const totalItems = pagination?.total || 0;
  const currentPage = pagination ? Math.floor(pagination.offset / pagination.limit) + 1 : 1;
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1;
  const itemsPerPage = pagination?.limit || 10;

  const setCurrentPage = (page: number) => {
    const offset = (page - 1) * itemsPerPage;
    handlePageChange(offset);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategories(filters);
      // Check if response is successful and has data
      if (response && response.success && response.data) {
        const categoriesData = response.data.data || [];
        
        setCategories(categoriesData);
        
        // Create pagination object that matches interface
        const paginationData = {
          data: categoriesData,
          pagination: {
            limit: response.data.limit || 10,
            offset: response.data.offset || 0,
            total: response.data.total || 0,
            hasNext: Boolean((response.data.offset || 0) + (response.data.limit || 10) < response.data.total || 0),
            hasPrev: Boolean((response.data.offset || 0) > 0)
          },
          total: response.data.total || 0,
          limit: response.data.limit || 10,
          offset: response.data.offset || 0
        };
        
        setPagination(paginationData);
        
        // Only show success toast when not initial load (when user explicitly searches/filters)
        if (filters.name || filters.offset !== 0) {
          toast.success('Tải danh sách danh mục thành công!');
        }
      } else {
        const errorMessage = response?.message || 'Failed to load categories';
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch categories';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((newFilters: Partial<FilterCategoryDto>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      offset: newFilters.offset !== undefined ? newFilters.offset : 0, // Reset to first page when filtering unless offset is explicitly set
    }));
  }, []);

  const handlePageChange = useCallback((newOffset: number) => {
    setFiltersState(prev => ({
      ...prev,
      offset: newOffset,
    }));
  }, []);

  const refreshCategories = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createCategory = async (data: any): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await categoryService.createCategory(data);
      if (response && response.success) {
        toast.success('Tạo danh mục thành công!');
        await fetchCategories();
        return true;
      } else {
        const errorMessage = response?.message || 'Failed to create category';
        toast.error(errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create category';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateCategory = async (id: number, data: any): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await categoryService.updateCategory(id, data);
      if (response && response.success) {
        toast.success('Cập nhật danh mục thành công!');
        await fetchCategories();
        return true;
      } else {
        const errorMessage = response?.message || 'Failed to update category';
        toast.error(errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update category';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (id: number): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await categoryService.deleteCategory(id);
      if (response && response.success) {
        toast.success('Xóa danh mục thành công!');
        await fetchCategories();
        return true;
      } else {
        const errorMessage = response?.message || 'Failed to delete category';
        toast.error(errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete category';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    submitting,
    error,
    totalItems,
    currentPage,
    totalPages,
    searchTerm,
    itemsPerPage,
    pagination,
    filters,
    setCurrentPage,
    setSearchTerm,
    setFilters,
    handlePageChange,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    clearError
  };
};
