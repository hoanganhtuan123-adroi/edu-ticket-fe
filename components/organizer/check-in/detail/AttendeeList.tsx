import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Search, Filter, CheckCircle, XCircle, ChevronDown } from "lucide-react";

interface Attendee {
  id: number;
  name: string;
  mssv: string;
  registrationDate: string;
  ticketType: string;
  checkInStatus: string;
  checkInTime: string | null;
}

interface Pagination {
  limit: number;
  offset: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface AttendeeListProps {
  attendees: Attendee[];
  pagination?: Pagination;
  isLoading?: boolean;
  onFilterChange?: (filters: {
    search: string;
    filter: 'all' | 'checked-in' | 'not-checked-in';
    page: number;
  }) => void;
  limit?: number;
};

const AttendeeList = memo<AttendeeListProps>(({ 
  attendees, 
  pagination, 
  isLoading, 
  onFilterChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'checked-in' | 'not-checked-in'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate current page from offset and limit
  const calculatedPage = pagination ? Math.floor(pagination.offset / pagination.limit) + 1 : 1;

  // Memoize the filter label function
  const getFilterLabel = useCallback((filter: 'all' | 'checked-in' | 'not-checked-in') => {
    switch (filter) {
      case 'all':
        return 'Tất cả';
      case 'checked-in':
        return 'Đã check-in';
      case 'not-checked-in':
        return 'Chưa check-in';
      default:
        return 'Tất cả';
    }
  }, []);

  // Memoize the callback to prevent unnecessary re-renders
  const handleFilterChange = useCallback((filter: 'all' | 'checked-in' | 'not-checked-in') => {
    setFilterStatus(filter);
    setShowFilterDropdown(false);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Memoize the search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Memoize the page change handler
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  // Debounce search and trigger filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange({
          search: searchTerm,
          filter: filterStatus,
          page: currentPage
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, onFilterChange]); // Remove currentPage from deps

  // Only trigger page change when page changes (not on initial load)
  useEffect(() => {
    if (onFilterChange && currentPage > 1) {
      onFilterChange({
        search: searchTerm,
        filter: filterStatus,
        page: currentPage
      });
    }
  }, [currentPage, searchTerm, filterStatus, onFilterChange]);

  // Memoize status badge function
  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "checked-in":
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>Đã check-in</span>
          </span>
        );
      case "not-checked-in":
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            <span>Chưa check-in</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Đang chờ
          </span>
        );
    }
  }, []);

  // Memoize ticket type info function
  const getTicketTypeInfo = useCallback((type: string) => {
    const typeMap = {
      'REGULAR': { label: 'Thường', color: 'bg-blue-100 text-blue-800' },
      'VIP': { label: 'VIP', color: 'bg-purple-100 text-purple-800' },
      'FREE': { label: 'Miễn phí', color: 'bg-gray-100 text-gray-800' },
      'Standard': { label: 'Tiêu chuẩn', color: 'bg-blue-100 text-blue-800' }, // Fallback for existing data
      'default': { label: type, color: 'bg-gray-100 text-gray-800' }
    };

    return typeMap[type as keyof typeof typeMap] || typeMap.default;
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Danh sách tham dự</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc MSSV..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <div className="relative">
              <button 
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Filter className="w-4 h-4" />
                <span>{getFilterLabel(filterStatus)}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleFilterChange('all')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        filterStatus === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => handleFilterChange('checked-in')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        filterStatus === 'checked-in' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      Đã check-in
                    </button>
                    <button
                      onClick={() => handleFilterChange('not-checked-in')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        filterStatus === 'not-checked-in' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      Chưa check-in
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MSSV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại vé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian check-in
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {attendee.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{attendee.mssv}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {attendee.registrationDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTicketTypeInfo(
                        attendee.ticketType
                      ).color}`}
                    >
                      {getTicketTypeInfo(attendee.ticketType).label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(attendee.checkInStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {attendee.checkInTime || "-"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        {pagination && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} của {pagination.total} kết quả
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(calculatedPage - 1)}
              >
                Trước
              </button>
              <span className="text-sm text-gray-600">
                Trang {calculatedPage} / {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button 
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(calculatedPage + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        ) || (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị 1-{attendees.length} của {attendees.length} kết quả
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Trước
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default AttendeeList;
