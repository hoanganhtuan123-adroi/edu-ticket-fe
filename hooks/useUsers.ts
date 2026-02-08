"use client";

import { useState, useEffect, useCallback } from 'react';
import { userService, FilterUserDto, UserResponse, PaginationResponse } from '@/service/admin/user.service';

interface UseUsersReturn {
  users: UserResponse[];
  loading: boolean;
  pagination: PaginationResponse<UserResponse> | null;
  filters: FilterUserDto;
  error: string | null;
  setFilters: (filters: Partial<FilterUserDto>) => void;
  handlePageChange: (newOffset: number) => void;
  refreshUsers: () => void;
  clearError: () => void;
}

export const useUsers = (initialFilters?: FilterUserDto): UseUsersReturn => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationResponse<UserResponse> | null>(null);
  const [filters, setFiltersState] = useState<FilterUserDto>({
    limit: 10,
    offset: 0,
    ...initialFilters
  });
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAllUsers(filters);
      // Check if response is successful and has data
      if (response && response.success) {
        const usersData = response.data.data || [];
        const paginationInfo = response.data.pagination;

        setUsers(usersData);

        // Create pagination object that matches interface
        const paginationData = {
          data: usersData,
          pagination: paginationInfo || {
            limit: 10,
            offset: 0,
            total: 0,
            hasNext: false,
            hasPrev: false
          },
          total: paginationInfo?.total || 0,
          limit: paginationInfo?.limit || 10,
          offset: paginationInfo?.offset || 0
        };

        setPagination(paginationData);

      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((newFilters: Partial<FilterUserDto>) => {
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

  const refreshUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    pagination,
    filters,
    error,
    setFilters,
    handlePageChange,
    refreshUsers,
    clearError,
  };
};
