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

export const bookingService = {
  // Create booking for client
  createBooking: async (bookingData: ClientBookingDto): Promise<BookingResponse> => {
    try {
      const token = getUserToken();
      const response = await api.post("/booking/event", bookingData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response as unknown as BookingResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể tạo đặt vé",
      );
    }
  },
};
