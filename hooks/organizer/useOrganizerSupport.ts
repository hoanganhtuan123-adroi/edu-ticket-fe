import { useState } from 'react';
import { supportService } from '@/service/organizer/support.service';
import { CreateSupportRequestDto, CreateSupportResponse, GetSupportRequestsResponse, FilterSupportRequestDto, GetSupportRequestDetailResponse } from '@/types/support.types';
import { Event } from '@/types/event.types';

export const useOrganizerSupport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSupportRequest = async (
    supportData: CreateSupportRequestDto,
    files?: File[]
  ): Promise<CreateSupportResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await supportService.createSupportRequest(supportData, files);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tạo yêu cầu hỗ trợ');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getSupportRequests = async (
    filters?: FilterSupportRequestDto
  ): Promise<GetSupportRequestsResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await supportService.getOrganizerSupportRequests(filters);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy danh sách yêu cầu hỗ trợ');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getSupportRequestById = async (id: string): Promise<GetSupportRequestDetailResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await supportService.getSupportRequestById(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy chi tiết yêu cầu hỗ trợ');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSupportRequest,
    getSupportRequests,
    getSupportRequestById,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
