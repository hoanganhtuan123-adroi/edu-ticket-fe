"use client";

import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import { useAdminEventDetail } from "@/hooks/admin/useAdminEvents";
import { ArrowLeft } from "lucide-react";
import AdminEventDetailContent from "@/components/admin/events/AdminEventDetailContent";

export default function AdminEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // Handle missing event ID
  if (!eventId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy sự kiện
            </h3>
            <p className="text-gray-600 mb-4">ID sự kiện không hợp lệ</p>
            <button
              onClick={() => router.push("/admin/events")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { event, loading, error, approveEvent, rejectEvent } =
    useAdminEventDetail(eventId);

  // Debug logging
  console.log("AdminEventDetailPage state:", {
    eventId,
    loading,
    error,
    event,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(price));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Nháp",
      },
      PENDING: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Chờ xử lý",
      },
      PENDING_APPROVAL: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Chờ duyệt",
      },
      APPROVED: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Đã duyệt",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Đã hủy",
      },
      COMPLETED: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Đã hoàn thành",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleApprove = async () => {
    const success = await approveEvent();
    if (success) {
      router.push("/admin/events");
    }
  };

  const handleReject = async () => {
    const success = await rejectEvent("Admin từ chối");
    if (success) {
      router.push("/admin/events");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đã xảy ra lỗi
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy sự kiện
            </h3>
            <p className="text-gray-600 mb-4">
              Sự kiện không tồn tại hoặc đã bị xóa
            </p>
            <button
              onClick={() => router.push("/admin/events")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* Event Detail Content */}
        <div className="relative">
          <AdminEventDetailContent
            event={event}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
}
