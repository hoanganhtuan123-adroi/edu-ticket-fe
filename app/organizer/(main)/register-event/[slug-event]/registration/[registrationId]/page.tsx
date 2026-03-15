"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// Import hooks
import { useEventRegistrations } from "@/hooks/organizer/useEventRegistrations";
import { registrationService } from "@/service/organizer/registration.service";

interface RegistrationDetail {
  id: string;
  fullName: string;
  studentCode: string;
  email?: string;
  bookingStatus: string;
  bookingTime: string;
  bookingCode?: string;
  totalAmount?: string;
  ticketName?: string;
  ticketTypeType?: string;
  ticketCode?: string;
  ticketStatus?: string;
}

interface EventInfo {
  title: string;
  slug: string;
  startTime: string;
  endTime: string;
  location: string;
  bannerUrl?: string;
}

export default function RegistrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventSlug = params["slug-event"] as string;
  const registrationId = params["registrationId"] as string;

  const [registration, setRegistration] = useState<RegistrationDetail | null>(
    null,
  );
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { getRegistrationDetails, approveRegistration, rejectRegistration } =
    useEventRegistrations();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRegistrationDetails(registrationId);

        if (response.success && response.data) {
          setRegistration(response.data.registration);
          setEvent(response.data.event);
        } else {
          toast.error(response.message || "Không thể tải thông tin đăng ký");
        }
      } catch (error: any) {
        toast.error(error.message || "Không thể tải thông tin đăng ký");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventSlug, registrationId, getRegistrationDetails]);

  const handleApprove = async () => {
    if (!registration?.bookingCode) {
      toast.error("Không tìm thấy mã đăng ký");
      return;
    }
    
    try {
      const success = await approveRegistration(registration.bookingCode);

      if (success) {
        toast.success("Đã duyệt đăng ký thành công");
        setRegistration((prev) =>
          prev ? { ...prev, bookingStatus: "PAID" } : null,
        );
      } else {
        toast.error("Duyệt đăng ký thất bại");
      }
    } catch (error: any) {
      toast.error(error.message || "Duyệt đăng ký thất bại");
    }
  };

  const handleReject = async () => {
    if (!registration?.bookingCode) {
      toast.error("Không tìm thấy mã đăng ký");
      return;
    }
    
    setShowRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!registration?.bookingCode) return;
    
    try {
      const success = await rejectRegistration(registration.bookingCode, rejectReason);

      if (success) {
        toast.success("Đã từ chối đăng ký");
        setRegistration((prev) =>
          prev ? { ...prev, bookingStatus: "REJECTED" } : null,
        );
        setShowRejectDialog(false);
        setRejectReason("");
      } else {
        toast.error("Từ chối đăng ký thất bại");
      }
    } catch (error: any) {
      toast.error(error.message || "Từ chối đăng ký thất bại");
    }
  };

  const cancelReject = () => {
    setShowRejectDialog(false);
    setRejectReason("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "PAID":
        return "Đã duyệt";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const getTicketTypeText = (ticketType?: string) => {
    switch (ticketType) {
      case "REGULAR":
        return "Vé thường";
      case "VIP":
        return "Vé VIP";
      case "FREE":
        return "Vé miễn phí";
    }
  };

  const getTicketStatusText = (ticketStatus?: string) => {
    switch (ticketStatus) {
      case "VALID":
        return "Hợp lệ";
      case "USED":
        return "Đã sử dụng";
      case "EXPIRED":
        return "Hết hạn";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return ticketStatus || "N/A";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <AlertCircle className="w-5 h-5" />;
      case "PAID":
        return <CheckCircle className="w-5 h-5" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-sm lg:text-base">
              Đang tải thông tin đăng ký...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!registration || !event) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center">
            <p className="text-gray-600">Không tìm thấy thông tin đăng ký</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chi tiết đăng ký
          </h1>
          <p className="text-gray-600">
            Xem thông tin chi tiết và duyệt đăng ký tham gia sự kiện
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-48 bg-linear-to-br from-gray-100 to-gray-200">
                {event.bannerUrl ? (
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-400 to-purple-600">
                    <Calendar className="w-12 h-12 text-white opacity-50" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>
                      {new Date(event.startTime).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Thông tin đăng ký
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Họ và tên
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {registration.fullName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Mã sinh viên
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {registration.studentCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Email
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {registration.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Thời gian đăng ký
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(registration.bookingTime).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Mã đăng ký
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {registration.bookingCode || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Tên vé
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {registration.ticketName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Loại vé
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {getTicketTypeText(registration.ticketTypeType) || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Mã vé
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {registration.ticketCode || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Trạng thái vé
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {getTicketStatusText(registration.ticketStatus) || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Trạng thái
              </h3>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(registration.bookingStatus)}`}
              >
                {getStatusIcon(registration.bookingStatus)}
                <span className="font-medium">
                  {getStatusText(registration.bookingStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar - Action Buttons */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Thao tác</h3>
              <div className="space-y-4">
                {registration.bookingStatus === "PENDING" && (
                  <>
                    <button
                      onClick={handleApprove}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Duyệt đăng ký
                    </button>
                    <button
                      onClick={handleReject}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      <XCircle className="w-5 h-5" />
                      Từ chối đăng ký
                    </button>
                  </>
                )}

                {registration.bookingStatus === "PAID" && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-green-800 font-medium">
                      Đăng ký đã được duyệt
                    </p>
                  </div>
                )}

                {registration.bookingStatus === "REJECTED" && (
                  <div className="text-center py-4">
                    <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <p className="text-red-800 font-medium">
                      Đăng ký đã bị từ chối
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              {registration.totalAmount && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {parseInt(registration.totalAmount).toLocaleString(
                        "vi-VN",
                      )}{" "}
                      VNĐ
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Lý do từ chối đăng ký
              </h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối đăng ký..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={confirmReject}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Xác nhận từ chối
                </button>
                <button
                  onClick={cancelReject}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
