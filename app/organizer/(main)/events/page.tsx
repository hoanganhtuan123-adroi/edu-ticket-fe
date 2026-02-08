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
    total: number;
    limit: number;
    offset: number;
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
      console.log(JSON.stringify(response))
      if (response.success && response.data) {
        setEvents(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: Math.ceil(response.data.total / response.data.limit)
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

  const handlePreviewEvent = (id: string) => {
    router.push(`/organizer/events/${id}/preview`);
  };

  const handleEditEvent = (id: string) => {
    router.push(`/organizer/events/${id}/edit`);
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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <EventsHeader onCreateEvent={handleCreateEvent} />
      
      <CategoriesSection
        categories={categories}
        loading={categoriesLoading}
        error={categoriesError}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {(!events || events.length === 0) ? (
        <EmptyState onCreateEvent={handleCreateEvent} />
      ) : (
        <>
          <EventsTable
            events={events || []}
            onPreview={handlePreviewEvent}
            onEdit={handleEditEvent}
          />
          
          {pagination.totalPages > 1 && (
            <EventsPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              total={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
