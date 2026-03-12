import api from "@/service/axios.config";

// Helper function to get user token from cookies
const getUserToken = () => {
  if (typeof window === "undefined") return null;

  // Get cookies from document
  const cookies = document.cookie.split(";");
  const userCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("USER="),
  );

  if (userCookie) {
    return userCookie.split("=")[1];
  }

  return null;
};

export interface ClientBookingDto {
  ticketTypeId: string;
  provider: "VNPAY" | "MOMO";
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    booking: {
      id: string;
      status: string;
      expiresAt: string;
    };
    payment?: {
      id: string;
      paymentCode: string;
      amount: number;
      status: string;
      paymentUrl?: string;
    };
    tickets?: Array<{
      id: string;
      ticketCode: string;
      qrCodeHash?: string;
      status: string;
    }>;
  };
}

export interface MyEvent {
  bookingCode: string;
  title: string;
  slug: string;
  bannerUrl: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  ticketCount?: number;
}

export interface MyEventsResponse {
  success: boolean;
  message: string;
  data: {
    data: MyEvent[];
    pagination: {
      limit: string;
      offset: string;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface MyEventsQuery {
  limit?: number;
  offset?: number;
  status?: string;
}

export interface BookingDetails {
  bookingCode: string;
  ticket: {
    qrCodeHash: string;
    ticketTypeName: string;
    ticketPrice: string;
    ticketStatus: string;
    ticketType: string;
    ticketCode: string;
    ticketDescription?: string;
  };
  event: {
    bannerUrl: string;
    title: string;
    startTime: string;
    endTime: string;
    location: string;
    slug: string;
    formattedDateTime: string;
  };
  payment: {
    totalAmount: string;
    provider: string;
    bankCode: string;
    providerTxnRef: string;
    paidAt: string;
    createdAt: string;
    paymentMethod: string;
  };
}

export interface BookingDetailsResponse {
  success: boolean;
  message: string;
  data: BookingDetails;
  timestamp: string;
}

export const bookingService = {
  // Create booking for client
  createBooking: async (bookingData: ClientBookingDto): Promise<any> => {
    try {
      const token = getUserToken();
      const response: any = await api.post("/booking/event", bookingData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log(`check response service :: ${response}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Không thể tạo đặt vé");
    }
  },

  // Get user's booked events
  getMyEvents: async (query: MyEventsQuery = {}): Promise<MyEventsResponse> => {
    try {
      const token = getUserToken();
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xem danh sách sự kiện");
      }

      const params = new URLSearchParams();

      if (query.limit) params.append("limit", query.limit.toString());
      if (query.offset) params.append("offset", query.offset.toString());
      if (query.status) params.append("status", query.status);

      const response: any = await api.get(
        `/booking/my-events?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Return response directly - let the hook handle success: false check
      return response as MyEventsResponse;
    } catch (error: any) {
      // Handle HTTP errors only
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng ký đã hết hạn, vui lòng đăng nhập lại");
      } else if (error.response?.status === 403) {
        throw new Error("Bạn không có quyền xem danh sách sự kiện");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error(
          "Không thể lấy danh sách sự kiện. Vui lòng thử lại sau.",
        );
      }
    }
  },

  // Get booking details
  getBookingDetails: async (
    bookingCode: string,
  ): Promise<BookingDetailsResponse> => {
    try {
      if (!bookingCode) {
        throw new Error("Booking Code is required");
      }

      const token = getUserToken();
      if (!token) {
        throw new Error("Bạn cần đăng nhập để xem chi tiết đặt vé");
      }

      const response: any = await api.get(`/booking/${bookingCode}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(JSON.stringify(response, null, 2));
      // Return response directly - let the hook handle success: false check
      return response;
    } catch (error: any) {
      // Handle HTTP errors only
      if (error.response?.status === 404) {
        throw new Error("Không tìm thấy thông tin đặt vé");
      } else if (error.response?.status === 401) {
        throw new Error("Phiên đăng ký đã hết hạn, vui lòng đăng nhập lại");
      } else if (error.response?.status === 403) {
        throw new Error("Bạn không có quyền xem thông tin đặt vé này");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("Không thể lấy chi tiết đặt vé. Vui lòng thử lại sau.");
      }
    }
  },
};
