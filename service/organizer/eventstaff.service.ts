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

export interface EventStaff {
  id: string;
  fullName: string;
  staffRole: string;
}

export interface EventStaffResponse {
  success: boolean;
  message: string;
  data: {
    data: EventStaff[];
    pagination: {
      limit: string;
      offset: string;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

class EventStaffService {
  async getEventStaff(
    eventId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<EventStaffResponse> {
    const token = getOrganizerToken();

    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const params = new URLSearchParams();

    // Ensure valid values for backend validation
    const validLimit = limit && limit > 0 ? limit : 10;
    const validOffset = offset && offset >= 0 ? offset : 0;

    params.append("limit", validLimit.toString());
    params.append("offset", validOffset.toString());

    const response: any = await api.get(
      `/event-staff/${eventId}?${params.toString()}`,
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

export const eventstaffService = new EventStaffService();
