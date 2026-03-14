"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DashboardFooter from "@/components/client/layout/DashboardFooter";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEventDetail } from "@/hooks/user/useEvent";
import { useBooking } from '@/hooks/user/useBooking';
import toast from "react-hot-toast";
import PurchaseModal from "@/components/client/event/PurchaseModal";
import EventBanner from "@/components/client/event/EventBanner";
import EventInfo from "@/components/client/event/EventInfo";
import SpeakersSection from "@/components/client/event/SpeakersSection";
import TargetAudienceSection from "@/components/client/event/TargetAudienceSection";
import TicketTypesSection from "@/components/client/event/TicketTypesSection";
import OrganizerInfo from "@/components/client/event/OrganizerInfo";
import ActionButtons from "@/components/client/event/ActionButtons";

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

  const getOverallTicketStatus = () => {
    if (!event || !event.ticketTypes || event.ticketTypes.length === 0) {
      return {
        text: "Liên hệ tổ chức",
        color: "bg-gray-500",
        disabled: true,
        message: "Sự kiện chưa có loại vé",
      };
    }

    // Check if user is already registered
    if (event.isRegistered) {
      return {
        text: "Đã đăng ký",
        color: "bg-green-600",
        disabled: true,
        message: "Bạn đã đăng ký tham gia sự kiện này",
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

  const handleTicketSelect = (ticket: any) => {
    setSelectedTicket(ticket);
    console.log("Ticket selected:", ticket);
    setShowPurchaseModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <EventBanner
          bannerUrl={event.bannerUrl}
          title={event.title}
          status={eventStatus}
        />

        {/* Event Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <EventInfo
              title={event.title}
              startTime={event.startTime}
              endTime={event.endTime}
              location={event.location}
              category={event.category}
              description={event.description}
              formatDate={formatDate}
            />

            {/* Additional Info from Settings */}
            {event.settings && (
              <div className="space-y-6">
                {/* Speakers Section */}
                {event.settings.speakers &&
                  event.settings.speakers.length > 0 && (
                    <SpeakersSection speakers={event.settings.speakers} />
                  )}

                {/* Target Audience Section */}
                {event.settings.targetAudience && (
                  <TargetAudienceSection
                    targetAudience={event.settings.targetAudience}
                  />
                )}

                {/* Ticket Types Section */}
                {event.ticketTypes && event.ticketTypes.length > 0 && (
                  <TicketTypesSection
                    ticketTypes={event.ticketTypes}
                    getTicketTypeLabel={getTicketTypeLabel}
                    getTicketStatusFromStatus={getTicketStatusFromStatus}
                    formatDate={formatDate}
                    formatPrice={formatPrice}
                    onTicketSelect={handleTicketSelect}
                  />
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Organizer Info */}
            <OrganizerInfo organizer={event.organizer} />

            {/* Action Buttons */}
            <ActionButtons ticketStatus={ticketStatus} />
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
