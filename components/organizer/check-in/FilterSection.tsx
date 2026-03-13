import React from "react";
import { Filter, Calendar, Clock, CalendarDays } from "lucide-react";

interface FilterSectionProps {
  currentFilter: "today" | "upcoming" | "all";
  onFilterChange: (filter: "today" | "upcoming" | "all") => void;
  totalEvents: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  currentFilter,
  onFilterChange,
  totalEvents,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-blue-500" />
          Bộ lọc sự kiện
        </h2>
        <span className="text-sm text-gray-500">
          {totalEvents > 0
            ? `${totalEvents} sự kiện được tìm thấy`
            : "Không có sự kiện nào"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onFilterChange("today")}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            currentFilter === "today"
              ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Hôm nay
          </span>
        </button>
        <button
          onClick={() => onFilterChange("upcoming")}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            currentFilter === "upcoming"
              ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Sắp diễn ra
          </span>
        </button>
        <button
          onClick={() => onFilterChange("all")}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            currentFilter === "all"
              ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <span className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2" />
            Tất cả
          </span>
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
