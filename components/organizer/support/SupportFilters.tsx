"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, Search } from 'lucide-react';
import { FilterSupportRequestDto } from '@/types/support.types';

interface SupportFiltersProps {
  filters: FilterSupportRequestDto;
  onFiltersChange: (filters: FilterSupportRequestDto) => void;
  isLoading?: boolean;
}

export default function SupportFilters({ filters, onFiltersChange, isLoading }: SupportFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleInputChange = (field: keyof FilterSupportRequestDto, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 10,
    });
  };

  const hasActiveFilters = filters.title || filters.status || filters.ticketCode;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc mã ticket..."
              value={filters.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                hasActiveFilters
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
            </button>

            {/* Dropdown Filters */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                >
                  <div className="space-y-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={filters.status || ''}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                      >
                        <option value="">Tất cả trạng thái</option>
                        <option value="OPEN">Mở</option>
                        <option value="IN_PROGRESS">Đang xử lý</option>
                        <option value="RESOLVED">Đã giải quyết</option>
                        <option value="CLOSED">Đã đóng</option>
                      </select>
                    </div>

                    {/* Ticket Code Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã ticket
                      </label>
                      <input
                        type="text"
                        placeholder="VD: SR00001"
                        value={filters.ticketCode || ''}
                        onChange={(e) => handleInputChange('ticketCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Áp dụng bộ lọc
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
