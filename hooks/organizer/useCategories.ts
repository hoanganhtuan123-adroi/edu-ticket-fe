"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  categoryService, 
  CategoryResponse 
} from '@/service/admin/category.service';

interface UseCategoriesReturn {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => void;
  clearError: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategories({ limit: 100, offset: 0 });
      if (response && response.success && response.data) {
        const categoriesData = response.data.data || [];
        setCategories(categoriesData);
      } else {
        const errorMessage = response?.message || 'Failed to load categories';
        setError(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch categories';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCategories = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refreshCategories,
    clearError
  };
};
