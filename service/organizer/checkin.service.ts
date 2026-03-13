import api from "@/service/axios.config";

// Helper function to get organizer token from cookies
const getOrganizerToken = () => {
  if (typeof window === "undefined") return null;

  // Get cookies from document
  const cookies = document.cookie.split(";");
  const organizerCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("USER_ORGANIZER="),
  );

  if (organizerCookie) {
    return organizerCookie.split("=")[1];
  }

  return null;
};

export interface CheckInEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  checkInStats: {
    checkedIn: number;
    totalSoldTickets: number;
    percentage: number;
  };
}

export interface CheckInEventsResponse {
  success: boolean;
  message: string;
  data: {
    data: CheckInEvent[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface CheckInFilters {
  filter?: "today" | "upcoming" | "all";
  limit?: number;
  offset?: number;
}

export interface CheckInDashboard {
  event: {
    id: string;
    title: string;
    status: string;
    date: string;
    time: string;
    location: string;
    startTime: string;
    endTime: string;
  };
  stats: {
    totalSoldTickets: number;
    checkedIn: number;
    notCheckedIn: number;
    percentage: number;
  };
}

export interface Attendee {
  id: string;
  name: string;
  mssv: string;
  registrationDate: string;
  ticketType: string;
  checkInStatus: 'checked-in' | 'not-checked-in';
  checkInTime: string | null;
}

export interface AttendeesResponse {
  data: Attendee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CheckInLogEntry {
  id: string;
  attendeeName: string;
  location: string;
  time: string;
  staffName: string;
  deviceId: string;
}

export interface CheckInLogsResponse {
  logs: CheckInLogEntry[];
}

class CheckInService {
  async getEventsForCheckIn(
    filters: CheckInFilters = {},
  ): Promise<CheckInEventsResponse> {
    const token = getOrganizerToken();

    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const params = new URLSearchParams();

    if (filters.filter) params.append("filter", filters.filter);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    const response: any = await api.get(
      `/check-in/events?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  }

  async checkInClient(ticketCode: string, deviceId: string): Promise<any> {
    const token = getOrganizerToken();
    
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const response: any = await api.post(
      "/check-in/scan",
      {
        ticketCode: ticketCode,
        deviceId: deviceId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  }

  async getCheckInDashboard(eventId: string): Promise<any> {
    const token = getOrganizerToken();
    
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const response: any = await api.get(
      `/check-in/events/${eventId}/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  }

  async getEventAttendees(
    eventId: string,
    limit: number = 10,
    offset: number = 0,
    search: string = '',
    filter: 'all' | 'checked-in' | 'not-checked-in' = 'all',
  ): Promise<any> {
    const token = getOrganizerToken();
    
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    if (search) params.append('search', search);
    if (filter) params.append('filter', filter);

    const response: any = await api.get(
      `/check-in/events/${eventId}/attendees?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  }

  async getCheckInLogs(
    eventId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<any> {
    const token = getOrganizerToken();
    
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response: any = await api.get(
      `/check-in/events/${eventId}/logs?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  }
}

export const checkinService = new CheckInService();
