"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Calendar, User, Tag, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { useAdminEvents } from '@/hooks/admin/useAdminEvents';
import { AdminEvent } from '@/service/admin/event.service';
import RejectEventModal from './RejectEventModal';

export default function AdminEventsTable() {
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
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
  }>({
    isOpen: false,
    eventId: '',
    eventTitle: '',
  });

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

  const handleRejectClick = (eventId: string, eventTitle: string) => {
    setRejectModal({
      isOpen: true,
      eventId,
      eventTitle,
    });
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      await rejectAdminEvent(rejectModal.eventId, reason);
      setRejectModal({ isOpen: false, eventId: '', eventTitle: '' });
    } catch (error) {
      console.error('Reject event error:', error);
    }
  };

  const handleRejectModalClose = () => {
    setRejectModal({ isOpen: false, eventId: '', eventTitle: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
        return 'Chờ phê duyệt';
      case 'APPROVED':
        return 'Đã phê duyệt';
      case 'CANCELLED':
        return 'Đã bị từ chối';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý sự kiện</h1>
            <p className="text-gray-600">Tổng số: {adminTotal} sự kiện</p>
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
                <option value="PENDING">Chờ phê duyệt</option>
                <option value="APPROVED">Đã phê duyệt</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="COMPLETED">Đã hoàn thành</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {(!adminEvents || adminEvents.length === 0) && !loading ? (
          <div className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có sự kiện nào</h3>
              <p className="text-gray-600">Không tìm thấy sự kiện nào phù hợp với bộ lọc của bạn.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Sự kiện</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Người tổ chức</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Danh mục</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Thời gian</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Trạng thái</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {adminEvents?.map((event: AdminEvent, index: number) => (
                  <tr 
                    key={event.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{event.title}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.organizer.fullName || event.organizer.email}
                        </p>
                        <p className="text-sm text-gray-500">{event.organizer.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{event.category.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {formatDate(event.startTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(event.endTime)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                        {getStatusIcon(event.status)}
                        <span>{getStatusText(event.status)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {event.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => approveAdminEvent(event.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Phê duyệt
                            </button>
                            <button
                              onClick={() => handleRejectClick(event.id, event.title)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Từ chối
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => router.push(`/admin/events/${event.id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {adminTotal > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Hiển thị {Math.min((adminFilters.offset || 0) + 1, adminTotal)} - {Math.min((adminFilters.offset || 0) + adminFilters.limit!, adminTotal)} của {adminTotal} sự kiện
            </div>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => updateAdminFilters({ offset: Math.max(0, (adminFilters.offset || 0) - adminFilters.limit!) })}
                disabled={(adminFilters.offset || 0) === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Trước
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(adminTotal / adminFilters.limit!)) }, (_, i) => {
                  const currentPage = Math.floor((adminFilters.offset || 0) / adminFilters.limit!) + 1;
                  const totalPages = Math.ceil(adminTotal / adminFilters.limit!);
                  let pageNum;
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  const isActive = pageNum === currentPage;
                  const pageOffset = (pageNum - 1) * adminFilters.limit!;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateAdminFilters({ offset: pageOffset })}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              {/* Next Button */}
              <button
                onClick={() => {
                  const nextOffset = (adminFilters.offset || 0) + adminFilters.limit!;
                  if (nextOffset < adminTotal) {
                    updateAdminFilters({ offset: nextOffset });
                  }
                }}
                disabled={(adminFilters.offset || 0) + adminFilters.limit! >= adminTotal}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
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

      {/* Reject Event Modal */}
      <RejectEventModal
        isOpen={rejectModal.isOpen}
        onClose={handleRejectModalClose}
        onReject={handleRejectConfirm}
        eventTitle={rejectModal.eventTitle}
        isLoading={loading}
      />
    </div>
  );
}
