"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { eventService } from "@/service/organizer/event.service";
import { Event } from "@/types/event.types";
import toast from "react-hot-toast";
import RegisterEventList from "@/components/organizer/events/RegisterEventList";

export default function RegisterEventPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [hasSearched, setHasSearched] = useState(false);

  const limit = 10;

  const fetchEvents = async (searchOverride?: string) => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * limit;
      const filters: any = {
        limit,
        offset,
      };

      // Add search filter (use override if provided, otherwise use current state)
      const currentSearch =
        searchOverride !== undefined ? searchOverride : searchTerm;
      if (currentSearch) {
        filters.title = currentSearch;
      }

      // Add status filter
      if (filterStatus && filterStatus !== "all") {
        filters.status = filterStatus;
      }

      const response = await eventService.getEventRegistrations(filters);
      if (response.success) {
        setEvents(response.data.data);
        setTotalEvents(response.data.pagination.total);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage, filterStatus]);

  const totalPages = Math.ceil(totalEvents / limit);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchTrigger = (searchTermValue: string) => {
    setCurrentPage(1); // Reset to first page when searching
    setHasSearched(true); // Mark that a search has been performed
    fetchEvents(searchTermValue);
  };

  const handlePreviewEvent = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  const handleEditEvent = (slug: string) => {
    router.push(`/organizer/events/${slug}/edit`);
  };

  const handleManageRegistrations = (slug: string) => {
    router.push(`/organizer/events/${slug}/registrations`);
  };

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
    <div className="container mx-auto py-8">
      <RegisterEventList
        events={events}
        loading={loading}
        pagination={{
          total: totalEvents,
          limit: limit,
          offset: (currentPage - 1) * limit,
          currentPage: currentPage,
          totalPages: totalPages,
        }}
        onPreviewEvent={handlePreviewEvent}
        onEditEvent={handleEditEvent}
        onPageChange={handlePageChange}
        title="Danh sách đăng ký"
        description="Quản lý các sự kiện cần đăng lý"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchTrigger={handleSearchTrigger}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onManageRegistrations={handleManageRegistrations}
        hasSearched={hasSearched}
      />
    </div>
  );
}
