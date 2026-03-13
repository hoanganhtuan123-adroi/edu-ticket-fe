import React from "react";
import { Calendar } from "lucide-react";

interface EmptyStateProps {
  filter: "today" | "upcoming" | "all";
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  const getEmptyMessage = () => {
    switch (filter) {
      case "today":
        return "Hôm nay không có sự kiện nào diễn ra. Hãy thử xem các sự kiện sắp tới nhé!";
      case "upcoming":
        return "Không có sự kiện nào sắp diễn ra trong 7 ngày tới.";
      default:
        return "Bạn chưa có sự kiện nào để hiển thị.";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16">
      <div className="text-center">
        <div className="bg-gray-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Không có sự kiện nào
        </h3>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          {getEmptyMessage()}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
