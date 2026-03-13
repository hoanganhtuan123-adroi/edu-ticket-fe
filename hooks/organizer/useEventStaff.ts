import { useState, useCallback } from 'react';
import { eventstaffService, EventStaff, EventStaffResponse } from '@/service/organizer/eventstaff.service';

export const useEventStaff = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEventStaff = useCallback(async (eventId: string, limit?: number, offset?: number) => {
    // Ensure we have valid values
    const validLimit = limit && limit > 0 ? limit : 10;
    const validOffset = offset && offset >= 0 ? offset : 0;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await eventstaffService.getEventStaff(eventId, validLimit, validOffset);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy danh sách nhân sự';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getEventStaff,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
