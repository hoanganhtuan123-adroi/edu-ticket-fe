"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useCheckIn } from "@/hooks/organizer/useCheckIn";
import { CheckInFilters } from "@/service/organizer/checkin.service";
import toast from "react-hot-toast";

// Import components
import SummaryCards from "@/components/organizer/check-in/SummaryCards";
import FilterSection from "@/components/organizer/check-in/FilterSection";
import EventCard from "@/components/organizer/check-in/EventCard";
import EmptyState from "@/components/organizer/check-in/EmptyState";
import LoadingState from "@/components/organizer/check-in/LoadingState";
import Pagination from "@/components/organizer/check-in/Pagination";

const CheckInPage = () => {
  const { getEventsForCheckIn, isLoading, error, clearError } = useCheckIn();
  const [events, setEvents] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState<CheckInFilters>({
    filter: "today",
    limit: 10,
    offset: 0,
  });

  const loadEvents = async () => {
    const response = await getEventsForCheckIn(filters);
    if (response?.success) {
      setEvents(response.data.data);
      setPagination(response.data.pagination);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  const handleFilterChange = (newFilter: "today" | "upcoming" | "all") => {
    setFilters((prev) => ({
      ...prev,
      filter: newFilter,
      offset: 0,
    }));
  };

  const handleCheckInUpdate = (eventId: string, newStats: any) => {
    // Update the events array with new stats for real-time UI update
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, checkInStats: newStats }
          : event
      )
    );
  };

  const handlePagination = (newOffset: number) => {
    setFilters((prev) => ({
      ...prev,
      offset: newOffset,
    }));
  };

  const getStatusColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colorMap[color] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate summary statistics
  const totalEvents = events.length;
  const totalCheckedIn = events.reduce(
    (sum, event) => sum + event.checkInStats.checkedIn,
    0,
  );
  const totalTickets = events.reduce(
    (sum, event) => sum + event.checkInStats.totalSoldTickets,
    0,
  );
  const averagePercentage =
    totalTickets > 0 ? Math.round((totalCheckedIn / totalTickets) * 100) : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Check-in Sự kiện
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Quản lý check-in cho các sự kiện của bạn một cách dễ dàng và
                hiệu quả
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 font-medium">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {events.length > 0 && (
          <SummaryCards
            totalEvents={totalEvents}
            totalCheckedIn={totalCheckedIn}
            totalTickets={totalTickets}
            averagePercentage={averagePercentage}
          />
        )}

        {/* Filter Section */}
        <FilterSection
          currentFilter={filters.filter || "today"}
          onFilterChange={handleFilterChange}
          totalEvents={pagination.total}
        />

        {/* Events List */}
        <div className="space-y-6">
          {isLoading ? (
            <LoadingState />
          ) : events.length === 0 ? (
            <EmptyState filter={filters.filter || "today"} />
          ) : (
            <>
              {events.map((event: any, index: number) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  index={index} 
                  onCheckInUpdate={handleCheckInUpdate}
                />
              ))}

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePagination}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
