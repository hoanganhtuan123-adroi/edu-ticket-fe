"use client";

import { useState, useEffect } from 'react';
import { categoryService, Category, GetCategoriesResponse } from '@/service/user/category.service';

export interface UseCategoriesOptions {
  limit?: number;
  offset?: number;
  name?: string;
}

export interface PaginatedCategoriesResponse {
  data: Category[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedCategoriesResponse['pagination']>({
    limit: 10,
    offset: 0,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchCategories = async (fetchOptions?: UseCategoriesOptions) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryService.getCategories({
        ...options,
        ...fetchOptions,
      });

      if (response.success && response.data) {
        setCategories(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách danh mục');
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.hasNext) {
      fetchCategories({
        ...options,
        offset: pagination.offset + pagination.limit,
      });
    }
  };

  const refresh = () => {
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, [options.limit, options.offset, options.name]);

  return {
    categories,
    loading,
    error,
    pagination,
    loadMore,
    refresh,
    fetchCategories,
  };
};
