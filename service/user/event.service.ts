import api from "@/service/axios.config";
import { Category } from "@/types/event.types";

// Helper function to get organizer token from cookies
const getOrganizerToken = () => {
  if (typeof window === "undefined") return null;

  // Get cookies from document
  const cookies = document.cookie.split(";");
  const organizerCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("USER="),
  );

  if (organizerCookie) {
    return organizerCookie.split("=")[1];
  }

  return null;
};

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data?: {
    categories: Category[];
  };
}

export interface EventDetailResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerUrl: string;
  location: string;
  status: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  settings?: {
    speakers?: Array<{
      name: string;
      title?: string;
      bio?: string;
      avatar?: string;
    }>;
    targetAudience?: string;
  };
  ticketTypes?: Array<{
    id: string;  // Thêm ID
    name: string;
    type: string;
    price: string;
    quantityLimit: number;
    soldQuantity: number;
    startSaleTime: string;
    endSaleTime: string;
    description?: string;
    status: string;
  }>;
  category: {
    name: string;
  };
  organizer: {
    fullName: string;
    email: string;
  };
}

export const eventService = {
  // Get all categories
  getCategories: async (): Promise<GetCategoriesResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get("/categories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response as unknown as GetCategoriesResponse; // Axios interceptor already returns response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách danh mục",
      );
    }
  },

  // Get event detail for user
  getEventDetailForUser: async (slug: string): Promise<EventDetailResponse> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get(`/events/organizer/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response as unknown as EventDetailResponse; // Axios interceptor already returns response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy chi tiết sự kiện",
      );
    }
  },

  // Get event detail for client users
  getEventDetail: async (slug: string): Promise<any> => {
    try {
      const token = getOrganizerToken();
      const response = await api.get(`/events/client/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response; // Return raw response with data wrapper
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy chi tiết sự kiện",
      );
    }
  },

  // Get organizer's events
  getMyEvents: async (filters?: {
    limit?: number;
    offset?: number;
    title?: string;
    location?: string;
    status?: string;
    categoryId?: string;
  }): Promise<any> => {
    try {
      const token = getOrganizerToken();
      const params = new URLSearchParams();
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.offset) params.append("offset", filters.offset.toString());
      if (filters?.title) params.append("title", filters.title);
      if (filters?.location) params.append("location", filters.location);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.categoryId)
        params.append("categoryId", filters.categoryId.toString());

      const response = await api.get(
        `/events/organizer-events?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách sự kiện",
      );
    }
  },

  // Get organizer's events
  getListEvents: async (filters?: {
    limit?: number;
    offset?: number;
    title?: string;
    categorySlug?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> => {
    try {
      const token = getOrganizerToken();
      const params = new URLSearchParams();
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.offset) params.append("offset", filters.offset.toString());
      if (filters?.title) params.append("title", filters.title);
      if (filters?.categorySlug)
        params.append("categorySlug", filters.categorySlug);
      if (filters?.startDate)
        params.append("startDate", filters.startDate);
      if (filters?.endDate)
        params.append("endDate", filters.endDate);

      const response = await api.get(
        `/events/client/list-events?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách sự kiện",
      );
    }
  },
};
