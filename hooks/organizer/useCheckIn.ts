import { useState, useCallback } from 'react';
import { 
  checkinService, 
  CheckInEvent, 
  CheckInFilters,
  CheckInDashboard,
  Attendee,
  AttendeesResponse,
  CheckInLogEntry,
  CheckInLogsResponse
} from '@/service/organizer/checkin.service';

export const useCheckIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEventsForCheckIn = useCallback(async (filters: CheckInFilters = {}) => {
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
  }, []);

  const checkInClient = useCallback(async (ticketCode: string, deviceId: string) => {
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
  }, []);

  const getCheckInDashboard = useCallback(async (eventId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await checkinService.getCheckInDashboard(eventId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy thông tin dashboard');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEventAttendees = useCallback(async (
    eventId: string,
    limit: number = 10,
    offset: number = 0,
    search: string = '',
    filter: 'all' | 'checked-in' | 'not-checked-in' = 'all'
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await checkinService.getEventAttendees(
        eventId,
        limit,
        offset,
        search,
        filter
      );
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy danh sách tham dự');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCheckInLogs = useCallback(async (
    eventId: string,
    limit: number = 20,
    offset: number = 0
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await checkinService.getCheckInLogs(eventId, limit, offset);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy logs check-in');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getEventsForCheckIn,
    checkInClient,
    getCheckInDashboard,
    getEventAttendees,
    getCheckInLogs,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
