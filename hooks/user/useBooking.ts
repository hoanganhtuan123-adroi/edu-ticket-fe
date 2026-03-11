"use client";

import { useState } from "react";
import { bookingService, ClientBookingDto, BookingResponse } from "@/service/user/booking.service";
import toast from "react-hot-toast";

export interface UseBookingOptions {
  onSuccess?: (data: BookingResponse) => void;
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
      
      if (response.success && response.data) {
        toast.success(response.message || "Đặt vé thành công!");
        
        // If payment URL exists, redirect to payment
        if (response.data.payment?.paymentUrl) {
          window.location.href = response.data.payment.paymentUrl;
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
