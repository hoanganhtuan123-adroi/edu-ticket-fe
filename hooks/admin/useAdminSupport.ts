import { useState } from "react";
import { FilterSupportRequestDto } from "@/types/support.types";
import {
  supportService,
  SupportRequestStatus,
} from "@/service/admin/support.service";
import toast from "react-hot-toast";

export const useAdminSupport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSupportRequests = async (filters?: FilterSupportRequestDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await supportService.getAdminSupportRequests(filters);
      return response;
    } catch (err: any) {
      const errorMessage =
        err.message || "Không thể lấy danh sách yêu cầu hỗ trợ";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getSupportRequestById = async (ticketCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await supportService.getAdminRequestByTicketCode(ticketCode);
      return response;
    } catch (err: any) {
      const errorMessage =
        err.message || "Không thể lấy chi tiết yêu cầu hỗ trợ";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const closeSupportRequest = async (ticketCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await supportService.closeSupportRequest(ticketCode);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Không thể đóng yêu cầu hỗ trợ";
      console.log(`Close support request error:`, err);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSupportStatus = async (
    ticketCode: string,
    status: SupportRequestStatus,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await supportService.updateSupportStatus(
        ticketCode,
        status,
      );
      if (result) {
        toast.success("Trạng thái đã được cập nhật");
      }

      return result;
    } catch (err: any) {
      const errorMessage =
        err.message || "Không thể cập nhật trạng thái yêu cầu hỗ trợ";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getSupportRequests,
    getSupportRequestById,
    closeSupportRequest,
    updateSupportStatus,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
