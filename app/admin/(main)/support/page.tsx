"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSupportRequestResponseDto, FilterSupportRequestDto } from '@/types/support.types';

import SupportFilters from '@/components/admin/support/SupportFilters';
import { useAdminSupport } from '@/hooks/admin/useAdminSupport';
import SupportRequestsTable from '@/components/admin/support/SupportRequestsTable';

export default function SupportRequestsPage() {
  const router = useRouter();
  const { getSupportRequests } = useAdminSupport();
  
  const [requests, setRequests] = useState<AdminSupportRequestResponseDto[]>([]);
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
      
      if (response && response.data) {
        setRequests(response.data || []);
        setPagination(response.pagination);
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
    router.push(`/admin/support/${ticketCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yêu cầu hỗ trợ
          </h1>
          <p className="text-gray-600">
            Xem và quản lý tất cả các yêu cầu hỗ trợ trong hệ thống.
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
