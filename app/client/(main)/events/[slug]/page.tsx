"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/client/layout/DashboardHeader";
import DashboardFooter from "@/components/client/layout/DashboardFooter";
import {
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  Users,
  Target,
  Ticket,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useEventDetail } from "@/hooks/user/useEvent";
import { useBooking } from '@/hooks/user/useBooking';
import toast from "react-hot-toast";
import PurchaseModal from "@/components/client/event/PurchaseModal";

const EventDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { event, loading, error } = useEventDetail(slug);
  const { createBooking, loading: bookingLoading } = useBooking({
    onSuccess: (response) => {
      setShowPurchaseModal(false);
      setSelectedTicket(null);
    },
  });
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getTicketTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      REGULAR: "Thường",
      VIP: "VIP",
      EARLY_BIRD: "Vé sớm",
      STUDENT: "Sinh viên",
      GROUP: "Nhóm",
      SPONSOR: "Nhà tài trợ",
      FREE: "Miễn phí",
    };
    return labels[type] || type;
  };

  const getEventStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return {
        color: "bg-blue-500",
        text: "Sắp diễn ra",
      };
    } else if (now >= start && now <= end) {
      return {
        color: "bg-green-500",
        text: "Đang diễn ra",
      };
    } else {
      return {
        color: "bg-gray-500",
        text: "Đã kết thúc",
      };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string) => {
    const priceValue = parseFloat(price);
    if (priceValue === 0) {
      return "Miễn phí";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(priceValue);
  };

  const getTicketStatusFromStatus = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          text: "Chưa mở bán",
          color: "bg-gray-500",
          disabled: true,
          message: "Vé chưa sẵn sàng bán",
        };
      case "UPCOMING":
        return {
          text: "Sắp mở bán",
          color: "bg-blue-500",
          disabled: true,
          message: "Vé sắp mở bán",
        };
      case "ON_SALE":
        return {
          text: "Đang mở bán",
          color: "bg-green-500",
          disabled: false,
          message: "Vé đang mở bán",
        };
      case "SOLD_OUT":
        return {
          text: "Hết vé",
          color: "bg-red-500",
          disabled: true,
          message: "Đã hết vé",
        };
      case "CLOSED":
        return {
          text: "Đã kết thúc",
          color: "bg-orange-500",
          disabled: true,
          message: "Đã hết thời gian bán vé",
        };
      default:
        return {
          text: "Liên hệ tổ chức",
          color: "bg-gray-500",
          disabled: true,
          message: "Liên hệ ban tổ chức để biết thêm thông tin",
        };
    }
  };

  const getTicketSaleStatus = (startSaleTime: string, endSaleTime: string) => {
    const now = new Date();
    const start = new Date(startSaleTime);
    const end = new Date(endSaleTime);

    if (now < start) {
      return {
        status: "upcoming",
        text: "Chưa mở bán",
        color: "bg-gray-500",
        disabled: true,
        message: `Vé sẽ mở bán vào ${formatDate(startSaleTime)}`,
      };
    } else if (now >= start && now <= end) {
      return {
        status: "available",
        text: "Đăng ký tham gia",
        color: "bg-purple-700",
        disabled: false,
        message: "Vé đang mở bán",
      };
    } else {
      return {
        status: "ended",
        text: "Đã kết thúc",
        color: "bg-red-500",
        disabled: true,
        message: "Đã hết thời gian đăng ký",
      };
    }
  };

  const getOverallTicketStatus = () => {
    if (!event || !event.ticketTypes || event.ticketTypes.length === 0) {
      return {
        text: "Liên hệ tổ chức",
        color: "bg-gray-500",
        disabled: true,
        message: "Sự kiện chưa có loại vé",
      };
    }

    // Check if any ticket is ON_SALE
    const hasOnSale = event.ticketTypes.some(
      (ticket) => ticket.status === "ON_SALE",
    );

    // Check if any ticket is UPCOMING
    const hasUpcoming = event.ticketTypes.some(
      (ticket) => ticket.status === "UPCOMING",
    );

    // Check if all tickets are SOLD_OUT or CLOSED
    const allSoldOutOrClosed = event.ticketTypes.every(
      (ticket) => ticket.status === "SOLD_OUT" || ticket.status === "CLOSED",
    );

    if (hasOnSale) {
      return {
        text: "Đăng ký tham gia",
        color: "bg-purple-700",
        disabled: false,
        message: "Vé đang mở bán",
      };
    } else if (hasUpcoming) {
      return {
        text: "Chưa mở bán",
        color: "bg-gray-500",
        disabled: true,
        message: "Vé sắp mở bán",
      };
    } else if (allSoldOutOrClosed) {
      return {
        text: "Đã kết thúc",
        color: "bg-red-500",
        disabled: true,
        message: "Đã hết thời gian đăng ký",
      };
    } else {
      return {
        text: "Liên hệ tổ chức",
        color: "bg-gray-500",
        disabled: true,
        message: "Liên hệ ban tổ chức để biết thêm thông tin",
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        </main>
        <DashboardFooter />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Sự kiện không tồn tại
            </h1>
            <p className="text-gray-600 mb-8">
              {error || "Không tìm thấy sự kiện bạn yêu cầu."}
            </p>
            <Link
              href="/client/dashboard"
              className="inline-flex items-center px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </div>
        </main>
        <DashboardFooter />
      </div>
    );
  }

  const eventStatus = getEventStatus(event.startTime, event.endTime);
  const ticketStatus = getOverallTicketStatus();

  // Purchase handler
  const handlePurchase = async (provider: "VNPAY" | "MOMO" = "VNPAY") => {
    console.log("Selected ticket:", selectedTicket);
    
    if (!selectedTicket?.id) {
      toast.error("Vui lòng chọn loại vé");
      return;
    }

    try {
      await createBooking({
        ticketTypeId: selectedTicket.id,
        provider: provider,
      });
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center text-purple-700 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách sự kiện
          </Link>
        </div>

        {/* Event Banner */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={event.bannerUrl || "/api/placeholder/1200/400"}
              alt={event.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span
                className={`${eventStatus.color} text-white px-4 py-2 rounded-full text-sm font-medium`}
              >
                {eventStatus.text}
              </span>
            </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Bắt đầu: {formatDate(event.startTime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Kết thúc: {formatDate(event.endTime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>

              {event.category && (
                <div className="mb-6">
                  <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {event.category.name}
                  </span>
                </div>
              )}

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Mô tả sự kiện
                </h2>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>
            </div>

            {/* Additional Info from Settings */}
            {event.settings && (
              <div className="space-y-6">
                {/* Speakers Section */}
                {event.settings.speakers &&
                  event.settings.speakers.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Diễn giả ({event.settings.speakers.length})
                      </h3>
                      <div className="space-y-4">
                        {event.settings.speakers.map(
                          (speaker: any, index: number) => (
                            <div
                              key={index}
                              className="flex gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
                            >
                              {/* Speaker Avatar */}
                              <div className="shrink-0">
                                {speaker.avatar ? (
                                  <img
                                    src={speaker.avatar}
                                    alt={speaker.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "/placeholder-avatar.jpg";
                                    }}
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                                    {speaker.name?.charAt(0)?.toUpperCase() ||
                                      "D"}
                                  </div>
                                )}
                              </div>

                              {/* Speaker Info */}
                              <div className="flex-1">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-600">
                                      Diễn giả:
                                    </span>
                                    <h4 className="font-semibold text-gray-900 text-lg">
                                      {speaker.name}
                                    </h4>
                                  </div>
                                  {speaker.title && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-600">
                                        Chức vụ:
                                      </span>
                                      <p className="text-sm text-purple-600 font-medium">
                                        {speaker.title}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                {speaker.bio && (
                                  <div className="bg-white rounded-lg p-3 border border-purple-200 mt-3">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      <span className="font-medium text-gray-600">
                                        Tiểu sử:{" "}
                                      </span>
                                      {speaker.bio}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Target Audience Section */}
                {event.settings.targetAudience && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Đối tượng tham gia
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-gray-700 leading-relaxed">
                        {event.settings.targetAudience}
                      </p>
                    </div>
                  </div>
                )}

                {/* Ticket Types Section */}
                {event.ticketTypes && event.ticketTypes.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-purple-600" />
                      Loại vé ({event.ticketTypes.length})
                    </h3>
                    <div className="space-y-4">
                      {event.ticketTypes.map((ticket: any, index: number) => {
                        const individualTicketStatus =
                          getTicketStatusFromStatus(ticket.status);
                        return (
                          <div
                            key={index}
                            className="border border-purple-200 rounded-lg p-4 bg-purple-50"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    {ticket.name}
                                  </h4>
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      ticket.type === "VIP"
                                        ? "bg-purple-100 text-purple-800"
                                        : ticket.type === "FREE"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {getTicketTypeLabel(ticket.type)}
                                  </span>
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      individualTicketStatus.color ===
                                      "bg-green-500"
                                        ? "bg-green-100 text-green-800"
                                        : individualTicketStatus.color ===
                                            "bg-blue-500"
                                          ? "bg-blue-100 text-blue-800"
                                          : individualTicketStatus.color ===
                                              "bg-red-500"
                                            ? "bg-red-100 text-red-800"
                                            : individualTicketStatus.color ===
                                                "bg-orange-500"
                                              ? "bg-orange-100 text-orange-800"
                                              : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {individualTicketStatus.text}
                                  </span>
                                </div>
                                {ticket.description && (
                                  <p className="text-sm text-gray-600 mb-3">
                                    {ticket.description}
                                  </p>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">
                                      Bán từ: {formatDate(ticket.startSaleTime)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">
                                      Đến: {formatDate(ticket.endSaleTime)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600">
                                      Giới hạn:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {ticket.quantityLimit} vé
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600">
                                      Đã bán:
                                    </span>
                                    <span className="font-medium text-green-600">
                                      {ticket.soldQuantity} vé
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-purple-600">
                                  {formatPrice(ticket.price)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Còn lại:{" "}
                                  {ticket.quantityLimit - ticket.soldQuantity}{" "}
                                  vé
                                </p>
                                <button
                                  className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
                                    individualTicketStatus.disabled
                                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                      : "bg-purple-700 text-white hover:bg-purple-800"
                                  }`}
                                  disabled={individualTicketStatus.disabled}
                                  onClick={() => {
                                    // Handle ticket purchase/registration
                                    if (!individualTicketStatus.disabled) {
                                      // Check if user is logged in (simple check)
                                      const userToken = document.cookie
                                        .split(";")
                                        .find((cookie) =>
                                          cookie.trim().startsWith("USER="),
                                        );
                                      if (!userToken) {
                                        toast.error(
                                          "Vui lòng đăng nhập để đăng ký vé!",
                                        );
                                        // TODO: Redirect to login page
                                        return;
                                      }

                                      // Check if tickets are available
                                      const availableTickets =
                                        ticket.quantityLimit -
                                        ticket.soldQuantity;
                                      if (availableTickets <= 0) {
                                        toast.error("Loại vé này đã hết!");
                                        return;
                                      }
                                      setSelectedTicket(ticket);
                                      console.log("Ticket selected:", ticket);
                                      setShowPurchaseModal(true);
                                    }
                                  }}
                                >
                                  {individualTicketStatus.disabled
                                    ? "Không thể đăng ký"
                                    : "Đăng ký ngay"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Organizer Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin ban tổ chức
              </h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {event.organizer.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.organizer.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <div
                  className={`text-center p-3 rounded-lg ${
                    ticketStatus.disabled ? "bg-gray-100" : "bg-green-100"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      ticketStatus.disabled ? "text-gray-600" : "text-green-700"
                    }`}
                  >
                    {ticketStatus.message}
                  </p>
                </div>
              </div>
              <button
                className={`w-full py-3 rounded-lg font-medium transition-colors mb-3 ${
                  ticketStatus.disabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : `${ticketStatus.color} text-white hover:opacity-90`
                }`}
                disabled={ticketStatus.disabled}
              >
                {ticketStatus.text}
              </button>
              <button className="w-full border border-purple-700 text-purple-700 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                Lưu sự kiện
              </button>
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        ticket={selectedTicket}
        event={event}
        onConfirm={handlePurchase}
        isProcessing={bookingLoading}
      />
    </div>
  );
};

export default EventDetailPage;
