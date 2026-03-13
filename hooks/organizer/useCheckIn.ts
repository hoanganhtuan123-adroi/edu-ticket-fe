import { useState } from 'react';
import { checkinService, CheckInEvent, CheckInFilters } from '@/service/organizer/checkin.service';

export const useCheckIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEventsForCheckIn = async (filters: CheckInFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await checkinService.getEventsForCheckIn(filters);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy danh sách sự kiện check-in');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkInClient = async (ticketCode: string, deviceId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await checkinService.checkInClient(ticketCode, deviceId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể check-in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getEventsForCheckIn,
    checkInClient,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
