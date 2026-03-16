import { useState, useCallback } from 'react';
import { registrationService } from '@/service/organizer/registration.service';
import toast from 'react-hot-toast';

export interface Registration {
  id: string;
  fullName: string;
  studentCode: string;
  bookingStatus: string;
  bookingTime: string;
  bookingCode: string;
}

export interface RegistrationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: number;
}

export interface RegistrationResponse {
  data: Registration[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useEventRegistrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<RegistrationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    approvalRate: 0
  });
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  const getEventRegistrations = useCallback(async (
    eventSlug: string,
    filters?: { 
      limit?: number; 
      offset?: number; 
      title?: string; 
      status?: string 
    }
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch registrations and stats in parallel
      const [registrationsResponse, statsResponse] = await Promise.all([
        registrationService.getEventRegistrations(eventSlug, filters),
        registrationService.getEventRegistrationStats(eventSlug)
      ]);
      
      if (registrationsResponse.success && registrationsResponse.data) {
        const responseData = registrationsResponse.data as RegistrationResponse;
        setRegistrations(responseData.data);
        setPagination(responseData.pagination);
      } else {
        setError(registrationsResponse.message);
        toast.error(registrationsResponse.message);
      }

      // Set stats from dedicated API
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        // Fallback: calculate from registration data if stats API fails
        if (registrationsResponse.success && registrationsResponse.data) {
          const responseData = registrationsResponse.data as RegistrationResponse;
          const total = responseData.pagination.total;
          const pending = responseData.data.filter(r => r.bookingStatus === "PENDING").length;
          const approved = responseData.data.filter(r => r.bookingStatus === "PAID").length;
          const rejected = responseData.data.filter(r => r.bookingStatus === "REJECTED").length;
          const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

          setStats({ total, pending, approved, rejected, approvalRate });
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch registrations";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRegistrationDetails = useCallback(async (registrationId: string) => {
    try {
      const response = await registrationService.getRegistrationDetails(registrationId);
      return response;
    } catch (error: any) {
      toast.error(error.message || "Không thể lấy chi tiết đăng ký");
      throw error;
    }
  }, []);

  const refreshStats = useCallback(async (eventSlug: string) => {
    try {
      const response = await registrationService.getEventRegistrationStats(eventSlug);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Failed to refresh stats:', error);
    }
  }, []);

  const approveRegistration = useCallback(async (bookingCode: string) => {
    try {
      const response = await registrationService.approveRegistration(bookingCode);
      return response.success;
    } catch (error: any) {
      throw error;
    }
  }, []);

  const rejectRegistration = useCallback(async (bookingCode: string, reason?: string) => {
    try {
      const response = await registrationService.rejectRegistration(bookingCode, reason);
      return response.success;
    } catch (error: any) {
      throw error;
    }
  }, []);

  const bulkApproveRegistrations = useCallback(async (bookingCodes: string[]) => {
    try {
      const response = await registrationService.bulkApproveRegistrations(bookingCodes);
      return response.success;
    } catch (error: any) {
      throw error;
    }
  }, []);

  return {
    registrations,
    stats,
    pagination,
    isLoading,
    error,
    getEventRegistrations,
    getRegistrationDetails,
    refreshStats,
    approveRegistration,
    rejectRegistration,
    bulkApproveRegistrations
  };
};
