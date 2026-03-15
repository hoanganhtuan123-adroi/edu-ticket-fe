import React, { useState } from "react";
import { Clock, MapPin, Users, ArrowRight, QrCode, BarChart3 } from "lucide-react";
import { CheckInEvent } from "@/service/organizer/checkin.service";
import QRScanner from "./QRScanner";
import toast from "react-hot-toast";
import Link from "next/link";

interface EventCardProps {
  event: CheckInEvent;
  index: number;
  onCheckInUpdate?: (eventId: string, newStats: any) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, index, onCheckInUpdate }) => {
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [eventStats, setEventStats] = useState(event.checkInStats); // Local state for real-time updates

  const getEventDisplayStatus = (status: string) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    
    if (status === 'PENDING')
      return { statusLabel: 'Chờ duyệt', color: 'orange' };
    if (status === 'APPROVED') {
      if (now < startTime)
        return { statusLabel: 'Sắp bắt đầu', color: 'blue' };
      if (now <= endTime)
        return { statusLabel: 'Đang diễn ra', color: 'green' };
      return { statusLabel: 'Đã kết thúc', color: 'gray' };
    }
    if (status === 'COMPLETED')
      return { statusLabel: 'Đã kết thúc', color: 'gray' };
    
    // Default fallback
    return { statusLabel: status, color: 'gray' };
  };

  const getStatusColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colorMap[color] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-6">
        {/* Event Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border ${getStatusColor(
                  getEventDisplayStatus(event.status).color
                )}`}
              >
                {getEventDisplayStatus(event.status).statusLabel}
              </span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                Mã sự kiện: #{event.id.slice(0, 8)}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời gian bắt đầu</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(event.startTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời gian kết thúc</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(event.endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 md:col-span-2">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Địa điểm</p>
                  <p className="font-medium text-gray-900">{event.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Check-in Statistics */}
        <div className="bg-linear-to-r from-gray-50 to-gray-100/50 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Đã check-in</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {eventStats.checkedIn}
                  </span>
                  <span className="text-gray-400 ml-1">
                    / {eventStats.totalSoldTickets}
                  </span>
                </div>
              </div>

              <div className="h-12 w-px bg-gray-200 hidden md:block"></div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Tỷ lệ check-in</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-blue-600">
                    {eventStats.percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(eventStats.percentage / 100) * 226.2} 226.2`}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              {/* Check-in Button - Only show for approved events */}
              {event.status === 'APPROVED' && (
                <button
                  className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md shadow-blue-200 flex items-center group/btn"
                  onClick={() => {
                    setIsQRScannerOpen(true);
                  }}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  <span>Quét QR Check-in</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}

              {/* Show disabled button for pending events */}
              {event.status !== 'APPROVED' && (
                <div className="relative">
                  <button
                    disabled
                    className="px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-medium shadow-md flex items-center opacity-60"
                    title="Sự kiện chưa được duyệt, không thể check-in"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    <span>Chờ duyệt</span>
                  </button>
                </div>
              )}

              {/* View Details Button */}
              <Link
                href={`/organizer/check-in/detail/${event.id}`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium flex items-center group"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                <span>Xem chi tiết</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* QR Scanner Modal */}
              <QRScanner
                isOpen={isQRScannerOpen}
                onClose={() => setIsQRScannerOpen(false)}
                eventId={event.id}
                onScanSuccess={(result) => {
                  console.log("Check-in successful:", result);
                  // You can update the event stats here if needed
                }}
                onCheckInSuccess={() => {
                  // Cập nhật stats real-time sau khi check-in thành công
                  const newStats = {
                    ...eventStats,
                    checkedIn: eventStats.checkedIn + 1,
                    percentage: eventStats.totalSoldTickets > 0 
                      ? Math.round(((eventStats.checkedIn + 1) / eventStats.totalSoldTickets) * 100)
                      : eventStats.percentage
                  };
                  setEventStats(newStats);
                  // Notify parent component
                  onCheckInUpdate?.(event.id, newStats);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
