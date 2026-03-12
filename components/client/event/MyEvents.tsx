"use client";

import React from "react";
import { Calendar, Clock, MapPin, Ticket, RefreshCw, Loader2, CheckCircle, Star, Mic, Music, Laptop, Download } from "lucide-react";
import Link from "next/link";

interface MyEventsProps {
  events: any[];
  loading: boolean;
  error: string | null;
  stats: {
    attendedEvents: number;
    upcomingEvents: number;
    attendedEventsLabel?: string;
    upcomingEventsLabel?: string;
    pageTitle?: string;
  };
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onRefresh: () => void;
}

const MyEvents: React.FC<MyEventsProps> = ({
  events,
  loading,
  error,
  stats,
  getStatusColor,
  getStatusText,
  onRefresh,
}) => {
  if (loading && events.length === 0) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-100">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {stats.pageTitle || "Lịch sử tham gia sự kiện"}
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Sự kiện đã tham gia */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.attendedEvents}</p>
              <p className="text-sm text-gray-600">{stats.attendedEventsLabel || "Tổng số sự kiện đã tham dự"}</p>
            </div>
          </div>

          {/* Card 2: Sự kiện sắp tới */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              <p className="text-sm text-gray-600">{stats.upcomingEventsLabel || "Sự kiện đã đăng ký và chờ diễn ra"}</p>
            </div>
          </div>
        </div>

        {events.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có sự kiện nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa đăng ký tham gia sự kiện nào. Hãy khám phá và đăng ký sự kiện ngay!
            </p>
            <Link
              href="/client/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Khám phá sự kiện
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Chi tiết lịch sử</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sự kiện
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tham dự
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số vé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`shrink-0 w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center mr-3`}>
                            <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.eventName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.eventDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.participationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.ticketCount} vé
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/client/registered-events/${item.bookingId}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Ticket className="w-4 h-4 mr-1" />
                          Xem vé
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error Message - Removed to avoid duplicate error displays */}
        {/* {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6">
            {error}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MyEvents;
