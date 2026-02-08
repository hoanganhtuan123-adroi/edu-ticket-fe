import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { eventService, CreateEventResponse, GetCategoriesResponse, SubmitForApprovalResponse } from '@/service/organizer/event.service';
import { CreateEventDto, Category, Event } from '@/types/event.types';

export const useEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getCategories = useCallback(async (): Promise<Category[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getCategories();
      if (response.success && response.data?.categories) {
        return response.data.categories;
      }
      throw new Error(response.message || 'Không thể lấy danh sách danh mục');
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy danh sách danh mục';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: CreateEventDto | FormData): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.createEvent(eventData);
      if (response.success && response.data?.event) {
        return response.data.event;
      }
      throw new Error(response.message || 'Không thể tạo sự kiện');
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tạo sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (eventId: string, eventData: Partial<CreateEventDto>): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.updateEvent(eventId, eventData);
      if (response.success && response.data?.event) {
        return response.data.event;
      }
      throw new Error(response.message || 'Không thể cập nhật sự kiện');
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể cập nhật sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventById = useCallback(async (eventId: string): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getEventById(eventId);
      if (response.success && response.data?.event) {
        return response.data.event;
      }
      throw new Error(response.message || 'Không thể lấy thông tin sự kiện');
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy thông tin sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitForApproval = useCallback(async (eventId: string): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.submitForApproval(eventId);
      if (response.success && response.data?.event) {
        return response.data.event;
      }
      throw new Error(response.message || 'Không thể gửi sự kiện để phê duyệt');
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể gửi sự kiện để phê duyệt';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyEvents = useCallback(async (filters?: { 
    limit?: number; 
    offset?: number; 
    title?: string; 
    location?: string; 
    status?: string; 
    categoryId?: string 
  }): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getMyEvents(filters);
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Không thể lấy danh sách sự kiện');
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể lấy danh sách sự kiện';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    getCategories,
    createEvent,
    updateEvent,
    getEventById,
    submitForApproval,
    getMyEvents,
  };
};
