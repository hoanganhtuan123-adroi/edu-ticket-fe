"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganizerSupport } from '@/hooks/organizer/useOrganizerSupport';
import { SupportRequestResponseDto, FilterSupportRequestDto } from '@/types/support.types';
import SupportRequestsTable from '@/components/organizer/support/SupportRequestsTable';
import SupportFilters from '@/components/organizer/support/SupportFilters';

export default function SupportRequestsPage() {
  const router = useRouter();
  const { getSupportRequests } = useOrganizerSupport();
  
  const [requests, setRequests] = useState<SupportRequestResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null>(null);
  const [filters, setFilters] = useState<FilterSupportRequestDto>({
    limit: 10,
  });

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await getSupportRequests(filters);
      if (response?.success && response.data) {
        setRequests(response.data.data || []);
        setPagination(response.data.pagination);
      } else {
        setRequests([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Failed to load support requests:', error);
      setRequests([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [filters]);

  const handleFiltersChange = (newFilters: FilterSupportRequestDto) => {
    setFilters({
      ...newFilters,
      offset: 0, // Reset to first page when filters change
    });
  };

  const handlePageChange = (offset: number) => {
    setFilters(prev => ({
      ...prev,
      offset,
    }));
  };

  const handleViewDetails = (ticketCode: string) => {
    router.push(`/organizer/support/requests/${ticketCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yêu cầu hỗ trợ đã gửi
          </h1>
          <p className="text-gray-600">
            Xem và quản lý tất cả các yêu cầu hỗ trợ bạn đã gửi.
          </p>
        </div>

        {/* Filters */}
        <SupportFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />

        {/* Results Summary */}
        {!isLoading && requests && requests.length > 0 && pagination && (
          <div className="mb-4 text-sm text-gray-600">
            Hiển thị {requests.length} trên {pagination.total} yêu cầu
          </div>
        )}

        {/* Requests Table */}
        <SupportRequestsTable
          requests={requests || []}
          isLoading={isLoading}
          onViewDetails={(ticketCode) => handleViewDetails(ticketCode)}
          pagination={pagination || undefined}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
