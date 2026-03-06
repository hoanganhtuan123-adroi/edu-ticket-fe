import { useState } from 'react';
import { FilterSupportRequestDto } from '@/types/support.types';
import { supportService } from '@/service/admin/support.service';

export const useAdminSupport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSupportRequests = async (
    filters?: FilterSupportRequestDto
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await supportService.getAdminSupportRequests(filters);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy danh sách yêu cầu hỗ trợ');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getSupportRequestById = async (ticketCode: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await supportService.getAdminRequestByTicketCode(ticketCode);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy chi tiết yêu cầu hỗ trợ');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getSupportRequests,
    getSupportRequestById,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
