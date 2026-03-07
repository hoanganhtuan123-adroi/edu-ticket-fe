'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { eventService } from '@/service/organizer/event.service';
import { useOrganizerCategories } from '@/hooks/organizer/useOrganizerCategories';
import { Event, EventStatus } from '@/types/event.types';
import { CategoryResponse } from '@/service/organizer/category.service';
import toast from 'react-hot-toast';

// Import components
import CategoriesSection from '@/components/organizer/events/CategoriesSection';
import EventsTable from '@/components/organizer/events/EventsTable';
import EmptyState from '@/components/organizer/events/EmptyState';
import EventsPagination from '@/components/organizer/events/EventsPagination';

interface EventListResponse {
  success: boolean;
  message: string;
  data: {
    data: Event[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    currentPage: 1,
    totalPages: 1
  });

  // Get categories using organizer hook
  const { categories, isLoading: categoriesLoading, error: categoriesError, getCategories } = useOrganizerCategories();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const filters: any = {
        limit: pagination.limit,
        offset: pagination.offset
      };
      
      // Add category filter if selected
      if (selectedCategory) {
        filters.categoryId = selectedCategory;
      }
      
      const response: EventListResponse = await eventService.getMyEvents(filters);
      if (response.success && response.data) {
        setEvents(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: Math.ceil(response.data.pagination.total / response.data.pagination.limit)
        }));
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải danh sách sự kiện');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [pagination.offset, selectedCategory]);

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    // Reset to first page when changing category filter
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      offset: 0
    }));
  };

  const handleCreateEvent = () => {
    router.push('/organizer/events/create');
  };

  const handlePreviewEvent = (slug: string) => {
    router.push(`/organizer/events/${slug}/preview`);
  };

  const handleEditEvent = (slug: string) => {
    router.push(`/organizer/events/${slug}/edit`);
  };

  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * pagination.limit;
    setPagination(prev => ({
      ...prev,
      currentPage: newPage,
      offset: newOffset
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-sm lg:text-base">Đang tải danh sách sự kiện...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="p-3 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Quản lý sự kiện</h1>
              <p className="text-gray-600 text-sm sm:text-base">Quản lý các sự kiện của bạn</p>
            </div>
            <button
              onClick={handleCreateEvent}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Tạo sự kiện mới</span>
            </button>
          </div>
          
          <CategoriesSection
            categories={categories}
            loading={categoriesLoading}
            error={categoriesError}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          {(!events || events.length === 0) ? (
            <div className="flex justify-center py-8 sm:py-12">
              <EmptyState onCreateEvent={handleCreateEvent} />
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <EventsTable
                  events={events || []}
                  onPreview={handlePreviewEvent}
                  onEdit={handleEditEvent}
                />
              </div>
              
              {pagination.totalPages > 1 && (
                <div className="flex justify-center px-2 sm:px-0">
                  <EventsPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    itemsPerPage={pagination.limit}
                    onPageChange={handlePageChange}
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
