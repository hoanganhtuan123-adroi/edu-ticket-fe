import React from 'react';
import { Tag, Loader2 } from 'lucide-react';
import { CategoryResponse } from '@/service/admin/category.service';

interface CategoriesSectionProps {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
  selectedCategory?: number | null;
  onCategorySelect?: (categoryId: number | null) => void;
}

export default function CategoriesSection({ 
  categories, 
  loading, 
  error, 
  selectedCategory, 
  onCategorySelect 
}: CategoriesSectionProps) {
  const handleCategoryClick = (categoryId: number) => {
    if (onCategorySelect) {
      // If clicking the already selected category, deselect it
      if (selectedCategory === categoryId) {
        onCategorySelect(null);
      } else {
        onCategorySelect(categoryId);
      }
    }
  };

  const handleClearFilter = () => {
    if (onCategorySelect) {
      onCategorySelect(null);
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span>Danh mục sự kiện</span>
            <span className="text-red-500">*</span>
          </h2>
          <div className="flex items-center gap-2 sm:gap-3">
            {selectedCategory && (
              <button
                onClick={handleClearFilter}
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-50"
              >
                Xóa bộ lọc
              </button>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                <span>Đang tải...</span>
              </div>
            )}
          </div>
        </div>
        
        {error ? (
          <div className="text-red-600 text-xs sm:text-sm p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((category: CategoryResponse) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`inline-flex items-center px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {category.name}
              </button>
            ))}
            {categories.length === 0 && !loading && (
              <div className="text-gray-500 text-xs sm:text-sm py-2">
                Chưa có danh mục nào
              </div>
            )}
          </div>
        )}
        
        {selectedCategory && (
          <div className="mt-3 text-xs sm:text-sm text-gray-600">
            Đang lọc theo: <span className="font-medium text-blue-600">
              {categories.find(c => c.id === selectedCategory)?.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
