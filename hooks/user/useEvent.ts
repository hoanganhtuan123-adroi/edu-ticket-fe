"use client";

import { useState, useEffect } from 'react';
import { eventService, EventDetailResponse } from '@/service/user/event.service';

export interface Event {
  title: string;
  slug: string;
  description: string;
  bannerUrl: string;
  location: string;
  startTime: string;
  endTime: string;
  status: string; // ticketSaleStatus from API
  ticketSaleStatus: string; // Add ticket sale status field
  isSoldOut: boolean;
  category: string;
  minPrice: number | null; // Add minimum price field
  maxPrice: number | null; // Add maximum price field
}

export interface PaginatedEventsResponse {
  data: Event[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UseEventsOptions {
  limit?: number;
  offset?: number;
  title?: string;
  categorySlug?: string;
  startDate?: string;
  endDate?: string;
}

export const useEvents = (options: UseEventsOptions = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedEventsResponse['pagination']>({
    limit: 10,
    offset: 0,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchEvents = async (fetchOptions?: UseEventsOptions) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventService.getListEvents({
        ...options,
        ...fetchOptions,
      });

      if (response.success && response.data) {
        setEvents(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Không thể lấy danh sách sự kiện');
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.hasNext) {
      fetchEvents({
        ...options,
        offset: pagination.offset + pagination.limit,
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [options.limit, options.offset, options.title, options.categorySlug, options.startDate, options.endDate]);

  return {
    events,
    loading,
    error,
    pagination,
    loadMore,
    fetchEvents,
  };
};

export const useEventDetail = (slug: string) => {
  const [event, setEvent] = useState<EventDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventDetail = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await eventService.getEventDetail(slug);
      
      // Extract data from API response
      if (response && response.data) {
        setEvent(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchEventDetail();
  };

  useEffect(() => {
    fetchEventDetail();
  }, [slug]);

  return {
    event,
    loading,
    error,
    refresh,
  };
};