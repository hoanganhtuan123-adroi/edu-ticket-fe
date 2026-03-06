import { useState } from 'react';
import { eventService } from '@/service/organizer/event.service';
import { Event } from '@/types/event.types';

export const useOrganizerEvents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMyEvents = async (filters?: { 
    limit?: number; 
    offset?: number; 
    title?: string; 
    location?: string; 
    status?: string; 
    categoryId?: string 
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getMyEvents(filters);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy danh sách sự kiện');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getEventDetail = async (slug: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getEventDetailForOrganizer(slug);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy chi tiết sự kiện');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await eventService.createEvent(eventData);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể tạo sự kiện');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (eventId: string, eventData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await eventService.updateEvent(eventId, eventData);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật sự kiện');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitForApproval = async (slug: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await eventService.submitForApproval(slug);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể gửi sự kiện để phê duyệt');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async (slug: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await eventService.toggleEventVisibility(slug);
      return response;
    } catch (err: any) {
      setError(err.message || 'Không thể thay đổi trạng thái hiển thị');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getMyEvents,
    getEventDetail,
    createEvent,
    updateEvent,
    submitForApproval,
    toggleVisibility,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
