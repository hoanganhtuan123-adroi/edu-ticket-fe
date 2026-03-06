"use client";

import { FilterSupportRequestDto } from '@/types/support.types';

interface SupportFiltersProps {
  filters: FilterSupportRequestDto;
  onFiltersChange: (filters: FilterSupportRequestDto) => void;
  isLoading: boolean;
}

export default function SupportFilters({
  filters,
  onFiltersChange,
  isLoading,
}: SupportFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      title: e.target.value || undefined,
    });
  };

  const handleTicketCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      ticketCode: e.target.value || undefined,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      status: e.target.value || undefined,
    });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      limit: parseInt(e.target.value),
      offset: 0, // Reset to first page when changing limit
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      limit: filters.limit,
      offset: 0,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Title Search */}
        <div>
          <label htmlFor="title-search" className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm theo tiêu đề
          </label>
          <input
            id="title-search"
            type="text"
            placeholder="Nhập tiêu đề yêu cầu..."
            value={filters.title || ''}
            onChange={handleSearchChange}
            disabled={isLoading}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
        </div>

        {/* Ticket Code Search */}
        <div>
          <label htmlFor="ticket-code-search" className="block text-sm font-medium text-gray-700 mb-1">
            Mã yêu cầu
          </label>
          <input
            id="ticket-code-search"
            type="text"
            placeholder="Nhập mã yêu cầu..."
            value={filters.ticketCode || ''}
            onChange={handleTicketCodeChange}
            disabled={isLoading}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            id="status-filter"
            value={filters.status || ''}
            onChange={handleStatusChange}
            disabled={isLoading}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm appearance-none bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="OPEN">Mở</option>
            <option value="IN_PROGRESS">Đang xử lý</option>
            <option value="RESOLVED">Đã giải quyết</option>
            <option value="CLOSED">Đã đóng</option>
          </select>
        </div>

        {/* Limit */}
        <div>
          <label htmlFor="limit-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng hiển thị
          </label>
          <select
            id="limit-filter"
            value={filters.limit}
            onChange={handleLimitChange}
            disabled={isLoading}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm appearance-none bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}
