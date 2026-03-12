"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookingDetails } from "@/hooks/user/useBooking";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import BookingHeader from "@/components/client/booking/BookingHeader";
import TicketInfo from "@/components/client/booking/TicketInfo";
import EventInfo from "@/components/client/booking/EventInfo";
import PaymentDetails from "@/components/client/booking/PaymentDetails";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingCode = params.bookingCode as string;

  // Memoize options to prevent re-renders
  const bookingOptions = useMemo(
    () => ({
      onSuccess: (data: any) => {
        console.log("Booking details loaded:", data);
      },
      onError: (error: string) => {
        // Remove console.error - let error state handle UI display
      },
    }),
    [],
  );

  const { bookingDetails, loading, error, fetchBookingDetails } =
    useBookingDetails(bookingOptions);

  useEffect(() => {
    if (bookingCode) {
      fetchBookingDetails(bookingCode);
    }
  }, [bookingCode]); // Remove fetchBookingDetails from dependencies

  const handleContinuePayment = () => {
    // Payment continuation logic would go here if needed
    // The new API response doesn't include continuePaymentUrl
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "VALID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-orange-100 text-orange-800";
      case "CANCELLED":
      case "USED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Chờ thanh toán";
      case "CANCELLED":
        return "Đã hủy";
      case "VALID":
        return "Hợp lệ";
      case "USED":
        return "Đã sử dụng";
      default:
        return status;
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numPrice);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
              <span className="text-gray-600">Đang tải thông tin vé...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Beautiful Error Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Error Header */}
              <div className="bg-linear-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      Đã có lỗi xảy ra
                    </h3>
                    <p className="text-red-100 text-sm">
                      Không thể tải thông tin đặt vé
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Content */}
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-red-800 font-medium">{error}</p>
                      <p className="text-red-600 text-sm mt-1">
                        Vui lòng kiểm tra lại mã đặt vé hoặc liên hệ hỗ trợ nếu
                        cần thiết.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.back()}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Loader2 className="w-4 h-4 mr-2" />
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy thông tin vé
            </h3>
            <button
              onClick={() => router.back()}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại danh sách vé
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết vé</h1>
        </div>

        <div className="space-y-6">
          {/* 1. Header - Status and Actions */}
          <BookingHeader
            bookingCode={bookingDetails.bookingCode}
            ticketStatus={bookingDetails.ticket?.ticketStatus || "PENDING"}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />

          {/* 2. Ticket and QR Code */}
          {bookingDetails.ticket && (
            <TicketInfo
              qrCodeHash={bookingDetails.ticket.qrCodeHash}
              ticketTypeName={bookingDetails.ticket.ticketTypeName}
              ticketPrice={bookingDetails.payment.totalAmount}
              ticketStatus={bookingDetails.ticket.ticketStatus}
              ticketType={bookingDetails.ticket.ticketType}
              ticketCode={bookingDetails.ticket.ticketCode}
              ticketDescription={bookingDetails.ticket.ticketDescription}
              bookingCode={bookingDetails.bookingCode}
              formatPrice={formatPrice}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          )}

          {/* 3. Event Information */}
          <EventInfo
            bannerUrl={bookingDetails.event.bannerUrl}
            title={bookingDetails.event.title}
            startTime={bookingDetails.event.startTime}
            endTime={bookingDetails.event.endTime}
            location={bookingDetails.event.location}
            slug={bookingDetails.event.slug}
            formattedDateTime={bookingDetails.event.formattedDateTime}
          />

          {/* 4. Payment Details */}
          <PaymentDetails
            totalAmount={bookingDetails.payment.totalAmount}
            provider={bookingDetails.payment.provider}
            bankCode={bookingDetails.payment.bankCode}
            providerTxnRef={bookingDetails.payment.providerTxnRef}
            paidAt={bookingDetails.payment.paidAt}
            createdAt={bookingDetails.payment.createdAt}
            paymentMethod={bookingDetails.payment.paymentMethod}
            formatPrice={formatPrice}
          />
        </div>
      </div>
    </div>
  );
}
