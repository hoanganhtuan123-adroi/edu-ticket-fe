"use client";

import React, { useState } from "react";
import { X, Download, ExternalLink, Calendar, MapPin, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useBookingDetails } from "@/hooks/user/useBooking";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  bookingId,
}) => {
  const { bookingDetails, loading, error, fetchBookingDetails } = useBookingDetails({
    onSuccess: (data) => {
      console.log('Booking details loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load booking details:', error);
    }
  });

  React.useEffect(() => {
    if (isOpen && bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [isOpen, bookingId, fetchBookingDetails]);

  const handleContinuePayment = () => {
    if (bookingDetails?.header.continuePaymentUrl) {
      window.location.href = bookingDetails.header.continuePaymentUrl;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'VALID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800';
      case 'CANCELLED':
      case 'USED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'VALID':
        return 'Hợp lệ';
      case 'USED':
        return 'Đã sử dụng';
      default:
        return status;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết vé</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Đang tải thông tin vé...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {bookingDetails && !loading && (
            <div className="space-y-6">
              {/* 1. Header - Status and Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mã đặt vé</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {bookingDetails.header.bookingId}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(bookingDetails.header.paymentStatus)}`}>
                      {getStatusText(bookingDetails.header.paymentStatus)}
                    </span>
                  </div>
                </div>
                
                {bookingDetails.header.paymentStatus === 'PAID' && (
                  <div className="flex items-center text-green-600 mb-4">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Cảm ơn bạn đã đặt vé!</span>
                  </div>
                )}

                {bookingDetails.header.continuePaymentUrl && (
                  <button
                    onClick={handleContinuePayment}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Tiếp tục thanh toán
                  </button>
                )}
              </div>

              {/* 2. Ticket and QR Code */}
              {bookingDetails.ticket && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin vé</h3>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* QR Code */}
                    <div className="shrink-0">
                      <div className="bg-gray-100 rounded-lg p-4">
                        {bookingDetails.ticket.qrCodeHash ? (
                          <img
                            src={bookingDetails.ticket.qrCodeHash}
                            alt="QR Code"
                            className="w-48 h-48 mx-auto cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => window.open(bookingDetails.ticket.qrCodeHash, '_blank')}
                          />
                        ) : (
                          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-2">
                        Nhấn để phóng to
                      </p>
                    </div>

                    {/* Ticket Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Mã vé</p>
                        <p className="font-mono text-lg font-semibold text-gray-900">
                          {bookingDetails.ticket.ticketCode}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Loại vé</p>
                        <p className="text-lg font-medium text-gray-900">
                          {bookingDetails.ticket.ticketTypeName}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Giá vé</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {bookingDetails.payment.formattedAmount}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Trạng thái vé</p>
                        <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(bookingDetails.ticket.ticketStatus)}`}>
                          {getStatusText(bookingDetails.ticket.ticketStatus)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Event Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sự kiện</h3>
                
                <div className="flex gap-4 mb-4">
                  {bookingDetails.event.bannerUrl && (
                    <img
                      src={bookingDetails.event.bannerUrl}
                      alt={bookingDetails.event.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {bookingDetails.event.title}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{bookingDetails.event.formattedDateTime}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{bookingDetails.event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {bookingDetails.event.slug && (
                  <button
                    onClick={() => window.open(`/client/events/${bookingDetails.event.slug}`, '_blank')}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Xem chi tiết sự kiện
                  </button>
                )}
              </div>

              {/* 4. Payment Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết thanh toán</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-semibold text-gray-900">{bookingDetails.payment.formattedAmount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="text-gray-900">{bookingDetails.payment.paymentMethod}</span>
                  </div>

                  {bookingDetails.payment.providerTxnRef && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã giao dịch:</span>
                      <span className="font-mono text-gray-900">{bookingDetails.payment.providerTxnRef}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian thanh toán:</span>
                    <span className="text-gray-900">
                      {bookingDetails.payment.paidAt 
                        ? new Date(bookingDetails.payment.paidAt).toLocaleString('vi-VN')
                        : 'Chưa thanh toán'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
