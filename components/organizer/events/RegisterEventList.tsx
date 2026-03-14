"use client";

import React, { useState } from "react";
import { Loader2, ChevronDown, Search } from "lucide-react";
import { Event } from "@/types/event.types";

// Import components
import EventCard from "@/components/organizer/events/EventCard";
import EventsPagination from "@/components/organizer/events/EventsPagination";

interface RegisterEventListProps {
  events: Event[];
  loading: boolean;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
  };
  onPreviewEvent: (slug: string) => void;
  onEditEvent: (slug: string) => void;
  onPageChange: (newPage: number) => void;
  onManageRegistrations?: (slug: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onSearchTrigger?: (searchTerm: string) => void;
  filterStatus?: string;
  onFilterChange?: (status: string) => void;
  title?: string;
  description?: string;
  hasSearched?: boolean;
}

const statusOptions = [
  { value: 'all', label: 'Tất cả sự kiện' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'ONGOING', label: 'Đang diễn ra' },
  { value: 'COMPLETED', label: 'Đã hoàn thành' },
];

export default function RegisterEventList({
  events,
  loading,
  pagination,
  onPreviewEvent,
  onEditEvent,
  onPageChange,
  onManageRegistrations,
  searchTerm = '',
  onSearchChange,
  onSearchTrigger,
  filterStatus,
  onFilterChange,
  hasSearched = false,
  title = "Danh sách sự kiện đã đăng ký",
  description = "Xem các sự kiện bạn đã đăng ký"
}: RegisterEventListProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchClick = () => {
    onSearchChange?.(localSearchTerm);
    onSearchTrigger?.(localSearchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const selectedStatus = statusOptions.find(option => option.value === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-sm lg:text-base">
              Đang tải danh sách sự kiện...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <div className="p-3 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600 text-sm sm:text-base">{description}</p>
            </div>
          </div>

          {(!events || events.length === 0) ? (
            <div className="flex justify-center py-8 sm:py-12">
              <div className="text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  {hasSearched ? 'Không có sự kiện' : 'Chưa có sự kiện nào được đăng ký'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Search and Filters Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Tìm kiếm sự kiện..."
                          value={localSearchTerm}
                          onChange={(e) => setLocalSearchTerm(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <Search className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <button
                        onClick={handleSearchClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 hover:bg-gray-50"
                    >
                      <span>{selectedStatus?.label || 'Tất cả sự kiện'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              onFilterChange?.(option.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-200 ${
                              filterStatus === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onManageRegistrations={onManageRegistrations}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center px-2 sm:px-0 mt-8">
                  <EventsPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    itemsPerPage={pagination.limit}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
