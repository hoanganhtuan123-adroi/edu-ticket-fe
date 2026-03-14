"use client";

import { useState, useEffect, useCallback } from "react";
import MyEvents from "@/components/client/event/MyEvents";
import { bookingService, MyEvent } from "@/service/user/booking.service";
import { useEventStats } from "@/hooks/user/useEvent";
import { Mic, Music, Laptop } from "lucide-react";
import toast from "react-hot-toast";

// Transform API data to table format
const transformEventData = (events: any[]) => {
  return events.map((event) => {
    // Determine icon based on event title or category
    const getIconForEvent = (title: string) => {
      if (title.toLowerCase().includes('hội thảo') || title.toLowerCase().includes('startup') || title.toLowerCase().includes('công nghệ')) {
        return { icon: Mic, color: 'text-blue-500', bg: 'bg-blue-100' };
      } else if (title.toLowerCase().includes('workshop') || title.toLowerCase().includes('digital')) {
        return { icon: Laptop, color: 'text-green-500', bg: 'bg-green-100' };
      } else if (title.toLowerCase().includes('hòa nhạc') || title.toLowerCase().includes('nhạc')) {
        return { icon: Music, color: 'text-orange-500', bg: 'bg-orange-100' };
      } else {
        return { icon: Laptop, color: 'text-purple-500', bg: 'bg-purple-100' };
      }
    };

    const iconData = getIconForEvent(event.title);

    return {
      id: event.bookingCode,
      bookingId: event.bookingCode, // Use bookingCode for navigation
      eventName: event.title,
      eventDate: new Date(event.startTime).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      participationDate: new Date(event.startTime).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      ticketCount: event.ticketCount || 1,
      status: event.status,
      icon: iconData.icon,
      iconColor: iconData.color,
      iconBg: iconData.bg,
    };
  });
};

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transformedEvents, setTransformedEvents] = useState<any[]>([]);
  
  // Fetch statistics from API
  const { stats: statsData, loading: statsLoading, error: statsError } = useEventStats();

  const fetchEvents = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await bookingService.getMyEvents({
      limit: 10,
      offset: 0,
    });
    
    // Check if API returned success: false - handle gracefully
    if (!response.success) {
      setError(response.message || "Không thể lấy danh sách sự kiện");
      return;
    }
    
    if (response.data) {
      setEvents(response.data.data);
      const transformed = transformEventData(response.data.data);
      setTransformedEvents(transformed);
    } else {
      setError(response.message || "Không nhận được dữ liệu sự kiện");
    }
  } catch (err: any) {
    const errorMessage = err.message || "Đã có lỗi xảy ra khi lấy danh sách sự kiện";
    setError(errorMessage);
    console.error('Error fetching events:', err);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Chờ thanh toán";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <MyEvents
      events={transformedEvents}
      loading={loading || statsLoading}
      error={error || statsError}
      stats={{
        attendedEvents: statsData?.totalRegisteredEvents || 0,
        upcomingEvents: statsData?.upcomingEvents || 0,
        attendedEventsLabel: "Tổng số sự kiện đã đăng ký",
        upcomingEventsLabel: "Sự kiện sắp diễn ra",
        pageTitle: "Sự kiện đã đăng ký",
      }}
      getStatusColor={getStatusColor}
      getStatusText={getStatusText}
      onRefresh={fetchEvents}
    />
  );
}
