import React from 'react';
import { Calendar, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateEvent: () => void;
}

export default function EmptyState({ onCreateEvent }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
      <div className="flex justify-center items-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-full mx-auto mb-4 sm:mb-6">
        <Calendar className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-400" />
      </div>
      <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-2">Chưa có sự kiện nào</h3>
      <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
        Bắt đầu bằng cách tạo sự kiện đầu tiên của bạn
      </p>
      <button
        onClick={onCreateEvent}
        className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base font-medium">Tạo sự kiện mới</span>
      </button>
    </div>
  );
}
