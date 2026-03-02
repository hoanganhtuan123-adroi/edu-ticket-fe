import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminEventService, AdminEventDetail, AdminEvent, AdminEventFilter } from '@/service/admin/event.service';

export const useAdminEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminEvents, setAdminEvents] = useState<AdminEvent[]>([]);
  const [adminTotal, setAdminTotal] = useState(0);
  const [adminFilters, setAdminFilters] = useState<AdminEventFilter>({
    limit: 10,
    offset: 0,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getAdminEvents = useCallback(async (filters?: AdminEventFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminEventService.getAllEvents(filters || adminFilters);
      if (response.success && response.data) {
        setAdminEvents(response.data.data);
        setAdminTotal(response.data.pagination.total);
        if (filters) {
          setAdminFilters(filters);
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy danh sách sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [adminFilters]);

  const updateAdminFilters = useCallback((newFilters: Partial<AdminEventFilter>) => {
    const updatedFilters = { ...adminFilters, ...newFilters };
    setAdminFilters(updatedFilters);
    return updatedFilters;
  }, [adminFilters]);

  const searchAdminEvents = useCallback((searchTerm: string) => {
    const newFilters = updateAdminFilters({ title: searchTerm, offset: 0 });
    getAdminEvents(newFilters);
  }, [getAdminEvents, updateAdminFilters]);

  const filterAdminEventsByStatus = useCallback((status: string) => {
    const newFilters = updateAdminFilters({ status, offset: 0 });
    getAdminEvents(newFilters);
  }, [getAdminEvents, updateAdminFilters]);

  const loadMoreAdminEvents = useCallback(() => {
    const newFilters = updateAdminFilters({ 
      offset: adminFilters.offset! + adminFilters.limit! 
    });
    getAdminEvents(newFilters);
  }, [getAdminEvents, updateAdminFilters, adminFilters.offset, adminFilters.limit]);

  const approveAdminEvent = useCallback(async (eventId: string) => {
    try {
      await adminEventService.approveEvent(eventId);
      toast.success('Phê duyệt sự kiện thành công');
      getAdminEvents(); // Refresh the list
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể phê duyệt sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [getAdminEvents]);

  const rejectAdminEvent = useCallback(async (eventId: string, reason?: string) => {
    try {
      await adminEventService.rejectEvent(eventId, reason);
      toast.success('Từ chối sự kiện thành công');
      getAdminEvents(); // Refresh the list
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể từ chối sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [getAdminEvents]);

  // Initial fetch for admin events
  useEffect(() => {
    getAdminEvents();
  }, [getAdminEvents]);

  return {
    loading,
    error,
    clearError,
    adminEvents,
    adminTotal,
    adminFilters,
    getAdminEvents,
    updateAdminFilters,
    searchAdminEvents,
    filterAdminEventsByStatus,
    loadMoreAdminEvents,
    approveAdminEvent,
    rejectAdminEvent,
  };
};

export const useAdminEventDetail = (eventId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<AdminEventDetail | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchEventDetail = useCallback(async () => {
    if (!eventId) {
      console.log('No eventId provided, skipping fetch');
      return;
    }
    
    console.log('Fetching event detail for:', eventId);
    setLoading(true);
    setError(null);
    
    try {
      const eventDetail = await adminEventService.getEventById(eventId);
      console.log('Event detail fetched:', eventDetail);
      setEvent(eventDetail);
    } catch (error: any) {
      console.error('Error fetching event detail:', error);
      const errorMessage = error.message || 'Không thể tải chi tiết sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const approveEvent = useCallback(async (): Promise<boolean> => {
    if (!event?.id) return false;
    
    try {
      await adminEventService.approveEvent(event.id);
      toast.success('Phê duyệt sự kiện thành công');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Không thể phê duyệt sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [event]);

  const rejectEvent = useCallback(async (reason?: string): Promise<boolean> => {
    if (!event?.id) return false;
    
    try {
      await adminEventService.rejectEvent(event.id, reason);
      toast.success('Từ chối sự kiện thành công');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Không thể từ chối sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [event]);

  useEffect(() => {
    fetchEventDetail();
  }, [fetchEventDetail]);

  return {
    event,
    loading,
    error,
    clearError,
    fetchEventDetail,
    approveEvent,
    rejectEvent,
  };
};
