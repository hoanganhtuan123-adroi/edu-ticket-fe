import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { userService, UserDetailResponse } from '@/service/admin/user.service';

export const useAdminUserDetail = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetailResponse | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUserDetail = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUserDetail(userId);
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin người dùng');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy thông tin người dùng';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    loading,
    error,
    user,
    fetchUserDetail,
    clearError,
  };
};
