import { useState, useCallback, useRef } from "react";
import {
  organizerUserService,
  FilterUserDto,
  UserResponse,
  PaginationResponse,
} from "@/service/organizer/user.service";

interface UseOrganizerUsersResult {
  users: UserResponse[];
  loading: boolean;
  error: string | null;
  pagination: PaginationResponse<UserResponse>["pagination"] | null;
  fetchUsers: (filters?: FilterUserDto) => Promise<void>;
  clearError: () => void;
}

export const useOrganizerUsers = (
  initialFilters?: FilterUserDto,
): UseOrganizerUsersResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [pagination, setPagination] = useState<
    PaginationResponse<UserResponse>["pagination"] | null
  >(null);

  // Use ref to store initialFilters to avoid dependency issues
  const initialFiltersRef = useRef(initialFilters);
  initialFiltersRef.current = initialFilters;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUsers = useCallback(async (filters?: FilterUserDto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await organizerUserService.getAllUsers(
        filters || initialFiltersRef.current || {},
      );
      console.log(JSON.stringify(response, null, 2));
      if (response.data && response.success) {
        setUsers(response.data.data || []);
        setPagination(response.data.pagination || null);
      } else {
        throw new Error(
          response.data?.message || "Không thể lấy danh sách người dùng",
        );
      }
    } catch (err: any) {
      const errorMessage = err.message || "Không thể lấy danh sách người dùng";
      setError(errorMessage);
      setUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array now

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    clearError,
  };
};
