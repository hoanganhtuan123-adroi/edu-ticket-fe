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
  statusColor: string;
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
}

export const checkinService = new CheckInService();
