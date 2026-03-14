"use client";

import React from "react";
import { Event } from "@/types/event.types";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface EventCardProps {
  event: Event;
  onManageRegistrations?: (slug: string) => void;
}

export default function EventCard({
  event,
  onManageRegistrations,
}: EventCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "PENDING_APPROVAL":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "DRAFT":
        return "Nháp";
      case "PENDING":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "CANCELLED":
        return "Đã hủy";
      case "ONGOING":
        return "Đang diễn ra";
      case "COMPLETED":
        return "Đã kết thúc";
      default:
        return status || "Không xác định";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const time = new Date(timeString);
    return time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Event Image */}
      <div className="relative h-48 bg-linear-to-br from-gray-100 to-gray-200">
        {event.bannerUrl ? (
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-event.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-400 to-purple-600">
            <Calendar className="w-12 h-12 text-white opacity-50" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}
          >
            {getStatusText(event.status)}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {event.title}
            </h3>

            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(event.startTime)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Numbers */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>Tổng số vé: {event.ticketTypeCount}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>Đã đăng ký: {event.bookingCount}</span>
            </div>
          </div>
          <button
            onClick={() => onManageRegistrations?.(event.slug || "")}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Xem chi tiết
          </button>
        </div>

        {/* Description */}
        {event.description && (
          <div className="text-sm text-gray-700 line-clamp-3">
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
}
