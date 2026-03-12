"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  bookingService,
  ClientBookingDto,
  BookingResponse,
  MyEventsResponse,
  MyEventsQuery,
  MyEvent,
  BookingDetailsResponse,
  BookingDetails,
} from "@/service/user/booking.service";
import toast from "react-hot-toast";

export interface UseBookingOptions {
  onSuccess?: (data: BookingResponse) => void;
  onError?: (error: string) => void;
}

export interface UseMyEventsOptions {
  onSuccess?: (data: MyEventsResponse) => void;
  onError?: (error: string) => void;
}

export interface UseBookingDetailsOptions {
  onSuccess?: (data: BookingDetailsResponse) => void;
  onError?: (error: string) => void;
}

export const useBooking = (options: UseBookingOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: ClientBookingDto) => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.createBooking(bookingData);
      console.log(
        `check response hook :: ${JSON.stringify(response, null, 2)}`,
      );
      if (response.success && response.data) {
        toast.success(response.message || "Đặt vé thành công!");

        // If payment URL exists, redirect to payment
        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        }

        options.onSuccess?.(response);
      } else {
        throw new Error(response.message || "Đặt vé thất bại");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Đã có lỗi xảy ra khi đặt vé";
      setError(errorMessage);
      toast.error(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    createBooking,
    resetError,
  };
};

export const useMyEvents = (options: UseMyEventsOptions = {}) => {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });
  const lastErrorRef = useRef<string | null>(null);

  const fetchEvents = async (query: MyEventsQuery = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.getMyEvents(query);
      
      // Check if API returned success: false - handle gracefully
      if (!response.success) {
        setError(response.message || "Không thể lấy danh sách sự kiện");
        
        // Only show toast if this is a new error
        if (lastErrorRef.current !== response.message) {
          toast.error(response.message || "Không thể lấy danh sách sự kiện");
          lastErrorRef.current = response.message || "Không thể lấy danh sách sự kiện";
        }
        
        options.onError?.(response.message || "Không thể lấy danh sách sự kiện");
        return;
      }
      
      if (response.data) {
        setEvents(response.data.data);
        setPagination({
          limit: parseInt(response.data.pagination.limit),
          offset: parseInt(response.data.pagination.offset),
          total: response.data.pagination.total,
          hasNext: response.data.pagination.hasNext,
          hasPrev: response.data.pagination.hasPrev,
        });
        lastErrorRef.current = null; // Clear error on success
        options.onSuccess?.(response);
      } else {
        setError(response.message || "Không nhận được dữ liệu sự kiện");
        
        // Only show toast if this is a new error
        if (lastErrorRef.current !== response.message) {
          toast.error(response.message || "Không nhận được dữ liệu sự kiện");
          lastErrorRef.current = response.message || "Không nhận được dữ liệu sự kiện";
        }
        
        options.onError?.(response.message || "Không nhận được dữ liệu sự kiện");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Đã có lỗi xảy ra khi lấy danh sách sự kiện";
      setError(errorMessage);
      
      // Only show toast if this is a new error
      if (lastErrorRef.current !== errorMessage) {
        toast.error(errorMessage);
        lastErrorRef.current = errorMessage;
      }
      
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.hasNext) {
      fetchEvents({
        limit: parseInt(pagination.limit.toString()),
        offset: pagination.offset + parseInt(pagination.limit.toString()),
      });
    }
  };

  const refresh = () => {
    lastErrorRef.current = null; // Reset error tracking on refresh
    fetchEvents({
      limit: pagination.limit,
      offset: 0,
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    pagination,
    fetchEvents,
    loadMore,
    refresh,
  };
};

export const useBookingDetails = (options: UseBookingDetailsOptions = {}) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastErrorRef = useRef<string | null>(null);

  const fetchBookingDetails = useCallback(async (bookingCode: string) => {
    if (!bookingCode) {
      setError("Booking Code is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.getBookingDetails(bookingCode);
      
      // Check if API returned success: false - handle gracefully
      if (!response.success) {
        setError(response.message || "Không thể lấy chi tiết đặt vé");
        
        // Only show toast if this is a new error
        if (lastErrorRef.current !== response.message) {
          toast.error(response.message || "Không thể lấy chi tiết đặt vé");
          lastErrorRef.current = response.message || "Không thể lấy chi tiết đặt vé";
        }
        
        options.onError?.(response.message || "Không thể lấy chi tiết đặt vé");
        return;
      }
      
      if (response.data) {
        setBookingDetails(response.data);
        lastErrorRef.current = null; // Clear error on success
        options.onSuccess?.(response);
      } else {
        setError(response.message || "Không nhận được dữ liệu đặt vé");
        
        // Only show toast if this is a new error
        if (lastErrorRef.current !== response.message) {
          toast.error(response.message || "Không nhận được dữ liệu đặt vé");
          lastErrorRef.current = response.message || "Không nhận được dữ liệu đặt vé";
        }
        
        options.onError?.(response.message || "Không nhận được dữ liệu đặt vé");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Đã có lỗi xảy ra khi lấy chi tiết đặt vé";
      setError(errorMessage);
      
      // Only show toast if this is a new error
      if (lastErrorRef.current !== errorMessage) {
        toast.error(errorMessage);
        lastErrorRef.current = errorMessage;
      }
      
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [options]);

  const clearBookingDetails = () => {
    setBookingDetails(null);
    setError(null);
    lastErrorRef.current = null;
  };

  return {
    bookingDetails,
    loading,
    error,
    fetchBookingDetails,
    clearBookingDetails,
  };
};
