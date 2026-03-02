'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { eventService } from '@/service/organizer/event.service';
import { useCategory } from '@/hooks/useCategory';
import { Event, EventStatus } from '@/types/event.types';
import { CategoryResponse } from '@/service/admin/category.service';
import toast from 'react-hot-toast';

// Import components
import OrganizerHeader from '@/components/organizer/layout/OrganizerHeader';
import EventsHeader from '@/components/organizer/events/EventsHeader';
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

  // Get categories using the existing hook
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategory();

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
        <OrganizerHeader />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Đang tải danh sách sự kiện...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <OrganizerHeader />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <EventsHeader onCreateEvent={handleCreateEvent} />
          
          <CategoriesSection
            categories={categories}
            loading={categoriesLoading}
            error={categoriesError}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          {(!events || events.length === 0) ? (
            <div className="flex justify-center py-12">
              <EmptyState onCreateEvent={handleCreateEvent} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <EventsTable
                  events={events || []}
                  onPreview={handlePreviewEvent}
                  onEdit={handleEditEvent}
                />
              </div>
              
              {pagination.totalPages > 1 && (
                <div className="flex justify-center">
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
