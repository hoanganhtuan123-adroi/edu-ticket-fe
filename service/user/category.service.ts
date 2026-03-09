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

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data?: {
    data: Category[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export const categoryService = {
  // Get all categories for users
  getCategories: async (options?: {
    limit?: number;
    offset?: number;
  }): Promise<GetCategoriesResponse> => {
    try {
      const token = getUserToken();
      const params = new URLSearchParams();
      
      if (options?.limit) params.append("limit", options.limit.toString());
      if (options?.offset) params.append("offset", options.offset.toString());

      const response = await api.get(
        `/categories?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      return response as unknown as GetCategoriesResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách danh mục",
      );
    }
  },
};
