import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/user/useCategory";
import { Category } from "@/service/user/category.service";
import { Calendar, Filter, Tag } from "lucide-react"; // Nếu bạn có dùng lucide-react, nếu không thì dùng icon khác

interface FilterSectionProps {
  onFilterChange?: (filters: any) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const { categories, loading } = useCategories({ limit: 20, offset: 0 });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [quickFilter, setQuickFilter] = useState("");
  const [startDate, setStartDate] = useState("");

  // Mỗi khi có bất kỳ thay đổi nào, tự động gọi onFilterChange (không cần nút Apply cho mượt)
  useEffect(() => {
    const filters: any = {};
    if (selectedCategory) filters.categorySlug = selectedCategory;
    if (startDate) filters.startDate = startDate;

    // Xử lý Quick Filter
    if (quickFilter === "isFree") filters.isFree = true;
    if (quickFilter === "today")
      filters.startDate = new Date().toISOString().split("T")[0];

    onFilterChange?.(filters);
  }, [selectedCategory, quickFilter, startDate]);

  return (
    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* 1. Ô Tìm kiếm ngày (Date Picker) */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm cursor-pointer"
            />
          </div>
        </div>

        {/* 2. Chọn Danh mục (Dropdown để tiết kiệm diện tích row) */}
        <div className="flex-1 min-w-[180px]">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm appearance-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Nút Reset nhanh */}
        {(startDate || selectedCategory || quickFilter) && (
          <button
            onClick={() => {
              setStartDate("");
              setSelectedCategory("");
              setQuickFilter("");
            }}
            className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors px-2"
          >
            Xóa lọc
          </button>
        )}
      </div>
    </section>
  );
};

export default FilterSection;
