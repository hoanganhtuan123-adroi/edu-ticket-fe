export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data?: Category;
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data?: {
    items: Category[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface CategoryFilter {
  limit?: number;
  offset?: number;
  name?: string;
}
