"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Calendar, MapPin, User, Tag, CheckCircle, XCircle, Eye, Clock, Users, Ticket } from 'lucide-react';
import { useAdminEvents } from '@/hooks/admin/useAdminEvents';
import { AdminEvent } from '@/service/admin/event.service';

export default function EventModerationList() {
  const router = useRouter();
  const { 
    adminEvents, 
    loading, 
    adminTotal, 
    adminFilters, 
    approveAdminEvent, 
    rejectAdminEvent, 
    searchAdminEvents, 
    filterAdminEventsByStatus,
    updateAdminFilters 
  } = useAdminEvents();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      searchAdminEvents('');
    } else {
      searchAdminEvents(term);
    }
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    if (status === 'all') {
      updateAdminFilters({ status: undefined, offset: 0 });
      searchAdminEvents('');
    } else {
      filterAdminEventsByStatus(status);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'PENDING_APPROVAL':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Nháp';
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PENDING_APPROVAL':
        return 'Chờ phê duyệt';
      case 'APPROVED':
        return 'Đã phê duyệt';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <Clock className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading && (!adminEvents || adminEvents.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-blue-200 border-t-transparent animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Kiểm duyệt sự kiện</h1>
            <p className="text-gray-600">Quản lý và phê duyệt các sự kiện được tạo bởi ban tổ chức</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200 hover:border-gray-300"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer transition-all duration-200 hover:border-gray-300"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING_APPROVAL">Chờ phê duyệt</option>
                <option value="APPROVED">Đã phê duyệt</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="COMPLETED">Đã hoàn thành</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Tổng sự kiện</p>
              <p className="text-3xl font-bold mt-1">{adminTotal}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Chờ phê duyệt</p>
              <p className="text-3xl font-bold mt-1">
                {adminEvents?.filter((e: AdminEvent) => e.status === 'PENDING_APPROVAL' || e.status === 'PENDING').length || 0}
              </p>
            </div>
            <div className="bg-amber-400 bg-opacity-30 rounded-full p-3">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Đã phê duyệt</p>
              <p className="text-3xl font-bold mt-1">
                {adminEvents?.filter((e: AdminEvent) => e.status === 'APPROVED').length || 0}
              </p>
            </div>
            <div className="bg-emerald-400 bg-opacity-30 rounded-full p-3">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {(!adminEvents || adminEvents.length === 0) && !loading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có sự kiện nào</h3>
              <p className="text-gray-600">Không tìm thấy sự kiện nào phù hợp với bộ lọc của bạn.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {adminEvents?.map((event: AdminEvent, index: number) => (
              <div 
                key={event.id} 
                className="bg-white rounded-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Event Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{event.title}</h3>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                          <span>{getStatusText(event.status)}</span>
                        </div>
                      </div>
                      
                      {/* Event Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{event.organizer.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Description */}
                    <div className="lg:col-span-2">
                      {event.description && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Mô tả sự kiện
                          </h4>
                          <p className="text-gray-600 line-clamp-3 leading-relaxed">{event.description}</p>
                        </div>
                      )}
                      
                      {/* Event Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center gap-3">
                            <Tag className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-blue-900 font-medium">Danh mục</p>
                              <p className="text-lg font-bold text-blue-600">{event.categoryName}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                          <div className="flex items-center gap-3">
                            <Ticket className="w-5 h-5 text-emerald-600" />
                            <div>
                              <p className="text-sm text-emerald-900 font-medium">Loại vé</p>
                              <p className="text-lg font-bold text-emerald-600">{event.ticketTypesCount}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-purple-900 font-medium">Tổng số lượng</p>
                              <p className="text-lg font-bold text-purple-600">{event.totalTicketQuantity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Banner */}
                    {event.bannerUrl && (
                      <div className="lg:col-span-1">
                        <div className="relative group">
                          <img 
                            src={event.bannerUrl}
                            alt={event.title}
                            className="w-full h-48 object-cover rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {event.status === 'PENDING_APPROVAL' && (
                      <>
                        <button
                          onClick={() => approveAdminEvent(event.id)}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Phê duyệt</span>
                        </button>
                        <button
                          onClick={() => rejectAdminEvent(event.id)}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-red-600 hover:to-red-700"
                        >
                          <XCircle className="w-5 h-5" />
                          <span>Từ chối</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => router.push(`/admin/events/${event.id}`)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-50"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Xem chi tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {adminEvents && adminEvents.length < adminTotal && !loading && (
        <div className="flex justify-center">
          <button
            onClick={() => updateAdminFilters({ offset: adminFilters.offset! + adminFilters.limit! })}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-blue-600 hover:to-blue-700"
          >
            <span>Tải thêm sự kiện</span>
            <div className="transform transition-transform duration-300 group-hover:translate-x-1">
              →
            </div>
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && adminEvents && adminEvents.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">Đang tải...</span>
          </div>
        </div>
      )}
    </div>
  );
}
