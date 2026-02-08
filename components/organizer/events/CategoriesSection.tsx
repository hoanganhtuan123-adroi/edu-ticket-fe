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
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            Danh mục sự kiện <span className="text-red-500">*</span>
          </h2>
          <div className="flex items-center gap-3">
            {selectedCategory && (
              <button
                onClick={handleClearFilter}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải...
              </div>
            )}
          </div>
        </div>
        
        {error ? (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category: CategoryResponse) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {category.name}
              </button>
            ))}
            {categories.length === 0 && !loading && (
              <div className="text-gray-500 text-sm">
                Chưa có danh mục nào
              </div>
            )}
          </div>
        )}
        
        {selectedCategory && (
          <div className="mt-3 text-sm text-gray-600">
            Đang lọc theo: <span className="font-medium text-blue-600">
              {categories.find(c => c.id === selectedCategory)?.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
