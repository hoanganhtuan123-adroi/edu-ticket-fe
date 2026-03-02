import React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Tag,
  Ticket,
  Info,
  Settings,
  Share2,
  Download,
  BarChart,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface EventDetailProps {
  eventData: any;
}

export default function EventDetail({ eventData }: EventDetailProps) {
  // Debug logging
  console.log('EventDetail - eventData:', eventData);
  console.log('EventDetail - approvalHistory:', eventData?.approvalHistory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Nháp",
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
        label: "Đã kết thúc",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            status === "APPROVED"
              ? "bg-green-500"
              : status === "PENDING_APPROVAL"
                ? "bg-yellow-500"
                : status === "CANCELLED"
                  ? "bg-red-500"
                  : status === "COMPLETED"
                    ? "bg-blue-500"
                    : "bg-gray-500"
          }`}
        />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section với Banner */}
        <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl">
          {eventData.bannerUrl ? (
            <img
              src={eventData.bannerUrl}
              alt={eventData.title}
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-banner.jpg';
              }}
            />
          ) : (
            <div className="h-80 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white/20 text-8xl font-bold">EVENT</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              {getStatusBadge(eventData.status)}
              <span className="flex items-center gap-1 text-sm text-white/90 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Tag className="w-3 h-3" />
                {eventData.category?.name}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
              {eventData.title}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl drop-shadow">
              {eventData.description || "Chưa có mô tả"}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Users,
              label: "Tổng vé",
              value:
                eventData.ticketTypes?.reduce(
                  (acc: number, t: any) => acc + t.quantityLimit,
                  0,
                ) || 0,
              color: "blue",
            },
            {
              icon: Ticket,
              label: "Đã bán",
              value:
                eventData.ticketTypes?.reduce(
                  (acc: number, t: any) => acc + t.soldQuantity,
                  0,
                ) || 0,
              color: "green",
            },
            {
              icon: Calendar,
              label: "Doanh thu",
              value: formatPrice(
                eventData.ticketTypes?.reduce(
                  (acc: number, t: any) => acc + t.price * t.soldQuantity,
                  0,
                ) || 0,
              ),
              color: "purple",
            },
            {
              icon: Clock,
              label: "Tỉ lệ lấp đầy",
              value: `${Math.round((eventData.ticketTypes?.reduce((acc: number, t: any) => acc + t.soldQuantity, 0) / eventData.ticketTypes?.reduce((acc: number, t: any) => acc + t.quantityLimit, 0)) * 100) || 0}%`,
              color: "orange",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Time & Location Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Địa điểm</h3>
                </div>
                <p className="text-gray-700 ml-12">{eventData.location}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Thời gian</h3>
                </div>
                <div className="ml-12 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {formatDate(eventData.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {formatDate(eventData.endTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Types */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Ticket className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Loại vé
                  </h3>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Xem chi tiết →
                </button>
              </div>

              {eventData.ticketTypes && eventData.ticketTypes.length > 0 ? (
                <div className="space-y-3">
                  {eventData.ticketTypes.map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className="group border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {ticket.name}
                            </h4>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                              {ticket.type}
                            </span>
                          </div>
                          {ticket.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {ticket.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="text-gray-600">
                              Giới hạn:{" "}
                              <span className="font-medium text-gray-900">
                                {ticket.quantityLimit}
                              </span>
                            </span>
                            <span className="text-gray-600">
                              Đã bán:{" "}
                              <span className="font-medium text-green-600">
                                {ticket.soldQuantity}
                              </span>
                            </span>
                            <span className="text-gray-600">
                              Còn lại:{" "}
                              <span className="font-medium text-orange-600">
                                {ticket.quantityLimit - ticket.soldQuantity}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {formatPrice(ticket.price)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {ticket.soldQuantity > 0 &&
                              `Doanh thu: ${formatPrice(ticket.price * ticket.soldQuantity)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Chưa có loại vé nào</p>
                  <button className="mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    + Thêm loại vé
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Organizer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                Nhà tổ chức
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {eventData.organizer?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {eventData.organizer?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {eventData.organizer?.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Metadata */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-500" />
                Thông tin bổ sung
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">ID sự kiện</span>
                  <span className="font-mono text-gray-900">
                    {eventData.id}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Slug</span>
                  <span className="text-gray-900">/{eventData.slug}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Ngày tạo</span>
                  <span className="text-gray-900">
                    {formatDate(eventData.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Cập nhật</span>
                  <span className="text-gray-900">
                    {formatDate(eventData.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Approval History */}
            {(() => {
              console.log('Checking approvalHistory:', eventData.approvalHistory);
              console.log('Length:', eventData.approvalHistory?.length);
              console.log('Should render:', eventData.approvalHistory && eventData.approvalHistory.length > 0);
              return eventData.approvalHistory && eventData.approvalHistory.length > 0;
            })() && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Lịch sử phê duyệt
                </h3>
                <div className="space-y-3">
                  {eventData.approvalHistory.map((history: any, index: number) => {
                    console.log('Rendering history item:', history);
                    return (
                      <div key={history.id} className="bg-white rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {history.action === 'APPROVED' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`font-medium text-sm ${
                              history.action === 'APPROVED' 
                                ? 'text-green-800' 
                                : 'text-red-800'
                            }`}>
                              {history.action === 'APPROVED' ? 'Đã phê duyệt' : 'Đã bị từ chối'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(history.createdAt)}
                          </span>
                        </div>
                        
                        {history.admin && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Người xử lý</p>
                            <p className="text-sm font-medium text-gray-900">
                              {history.admin.fullName || 'Hệ thống'}
                            </p>
                            <p className="text-xs text-gray-600">{history.admin.email}</p>
                          </div>
                        )}
                        
                        {history.reason && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Lý do</p>
                            <p className="text-sm text-gray-700 bg-amber-50 rounded p-3 border border-amber-200">
                              {history.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Thao tác nhanh
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg hover:bg-blue-50 transition-colors group">
                  <span className="flex items-center gap-2 text-gray-700">
                    <BarChart className="w-4 h-4" />
                    Xem báo cáo
                  </span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg hover:bg-blue-50 transition-colors group">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Share2 className="w-4 h-4" />
                    Chia sẻ
                  </span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg hover:bg-blue-50 transition-colors group">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Download className="w-4 h-4" />
                    Xuất dữ liệu
                  </span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
