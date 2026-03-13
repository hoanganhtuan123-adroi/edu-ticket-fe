"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Import components
import EventOverview from "@/components/organizer/check-in/detail/EventOverview";
import SummaryStatistics from "@/components/organizer/check-in/detail/SummaryStatistics";
import AttendeeList from "@/components/organizer/check-in/detail/AttendeeList";
import LiveCheckInLog from "@/components/organizer/check-in/detail/LiveCheckInLog";
import AssignedStaff from "@/components/organizer/check-in/detail/AssignedStaff";

// Import hook
import { useCheckIn } from "@/hooks/organizer/useCheckIn";
import { useEventStaff } from "@/hooks/organizer/useEventStaff";

const CheckInDetailPage = () => {
  const params = useParams();
  const eventId = params.id as string;

  const {
    getCheckInDashboard,
    getEventAttendees,
    getCheckInLogs,
    isLoading,
    error,
  } = useCheckIn();

  const { getEventStaff } = useEventStaff();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [attendees, setAttendees] = useState<any>(null);
  const [logs, setLogs] = useState<any>(null);
  const [staff, setStaff] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    filter: 'all' as 'all' | 'checked-in' | 'not-checked-in',
    limit: 10,
    offset: 0
  });

  const [logsFilters, setLogsFilters] = useState({
    limit: 20,
    offset: 0
  });

  const [staffFilters, setStaffFilters] = useState({
    limit: 10,
    offset: 0
  });

  // Mock data for AssignedStaff (will be replaced with API later)
  const mockStaffData = [
    {
      id: "1",
      name: "Hoàng Anh Tuấn",
      role: "MANAGER",
      status: true
    },
    {
      id: "2", 
      name: "Nguyễn Văn A",
      role: "STAFF",
      status: true
    },
    {
      id: "3",
      name: "Trần Thị B",
      role: "STAFF", 
      status: false
    }
  ];

  const fetchAllData = useCallback(async () => {
    try {
      // Fetch dashboard only (logs will be fetched separately)
      const dashboardResponse = await getCheckInDashboard(eventId);

      if (dashboardResponse?.success) {
        setDashboardData(dashboardResponse.data);
      }
    } catch (error) {
      console.error("Error fetching check-in data:", error);
    }
  }, [eventId, getCheckInDashboard]);

  const fetchAttendees = useCallback(async () => {
    try {
      const attendeesResponse = await getEventAttendees(
        eventId,
        filters.limit,
        filters.offset,
        filters.search,
        filters.filter
      );

      if (attendeesResponse?.success) {
        setAttendees(attendeesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
    }
  }, [eventId, filters.limit, filters.offset, filters.search, filters.filter, getEventAttendees]);

  const fetchLogs = useCallback(async () => {
    try {
      const logsResponse = await getCheckInLogs(
        eventId,
        logsFilters.limit,
        logsFilters.offset
      );

      if (logsResponse?.success) {
        setLogs(logsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, [eventId, logsFilters.limit, logsFilters.offset, getCheckInLogs]);

  const fetchStaff = useCallback(async () => {
    // Don't fetch if eventId is not available
    if (!eventId) {
      return;
    }

    try {
      const staffResponse = await getEventStaff(
        eventId,
        staffFilters.limit,
        staffFilters.offset
      );

      if (staffResponse?.success) {
        // Transform API response to component format
        const transformedData = {
          data: staffResponse.data.data.map((staffMember: any) => ({
            id: staffMember.id,
            name: staffMember.fullName,
            role: staffMember.staffRole,
            status: true, // Default to active since API only returns active staff
          })),
          pagination: {
            limit: Number(staffResponse.data.pagination.limit),
            offset: Number(staffResponse.data.pagination.offset),
            total: staffResponse.data.pagination.total,
            hasNext: staffResponse.data.pagination.hasNext,
            hasPrev: staffResponse.data.pagination.hasPrev,
          }
        };
        setStaff(transformedData);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  }, [eventId, staffFilters, getEventStaff]);

  const handleFilterChange = useCallback((newFilters: {
    search: string;
    filter: 'all' | 'checked-in' | 'not-checked-in';
    page: number;
  }) => {
    setFilters(prev => ({
      ...prev,
      search: newFilters.search,
      filter: newFilters.filter,
      offset: (newFilters.page - 1) * prev.limit // Convert page to offset
    }));
  }, []);

  const handleLogsPageChange = useCallback((newOffset: number) => {
    setLogsFilters(prev => ({
      ...prev,
      offset: newOffset
    }));
  }, []);

  const handleStaffPageChange = useCallback((newOffset: number) => {
    setStaffFilters(prev => ({
      ...prev,
      offset: newOffset
    }));
  }, []);

  useEffect(() => {
    if (eventId) {
      fetchAllData();
    }
  }, [eventId, fetchAllData]);

  useEffect(() => {
    if (eventId) {
      fetchAttendees();
    }
  }, [eventId, filters, fetchAttendees]);

  useEffect(() => {
    if (eventId) {
      fetchLogs();
    }
  }, [eventId, logsFilters, fetchLogs]);

  useEffect(() => {
    if (eventId) {
      fetchStaff();
    }
  }, [eventId, staffFilters, fetchStaff]);

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu check-in...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Clock className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchAllData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy dữ liệu check-in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/organizer/check-in"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Check-in Details
            </h1>
          </div>

          {/* Event Overview */}
          <section id="overview" className="mb-8">
            <EventOverview event={dashboardData.event} />
          </section>

          {/* Summary Statistics */}
          <section className="mb-8">
            <SummaryStatistics statistics={dashboardData.stats} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Attendee List */}
            <section id="attendees" className="lg:col-span-2">
              <AttendeeList 
                attendees={attendees?.data || []} 
                pagination={attendees?.pagination}
                isLoading={isLoading}
                onFilterChange={handleFilterChange}
              />
            </section>

            {/* Live Check-in Log */}
            <section className="lg:col-span-1">
              <LiveCheckInLog 
                eventId={eventId}
                pagination={logs?.pagination}
                onPageChange={handleLogsPageChange}
              />
            </section>
          </div>

          {/* Assigned Staff */}
          <section id="staff" className="mt-8">
            <AssignedStaff 
              staff={staff?.data || []}
              pagination={staff?.pagination || {
                limit: 10,
                offset: 0,
                total: 0,
                hasNext: false,
                hasPrev: false
              }}
              onPageChange={handleStaffPageChange}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default CheckInDetailPage;
