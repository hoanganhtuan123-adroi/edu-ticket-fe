import React from "react";

interface PaginationProps {
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange: (newOffset: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const handlePrev = () => {
    onPageChange(Math.max(0, pagination.offset - pagination.limit));
  };

  const handleNext = () => {
    onPageChange(pagination.offset + pagination.limit);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">
            {Math.min(pagination.offset + 1, pagination.total)}
          </span>
          {" - "}
          <span className="font-medium">
            {Math.min(pagination.offset + pagination.limit, pagination.total)}
          </span>
          {" / "}
          <span className="font-medium">{pagination.total}</span> sự kiện
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handlePrev}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ← Trang trước
          </button>
          <button
            onClick={handleNext}
            disabled={!pagination.hasNext}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Trang sau →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
