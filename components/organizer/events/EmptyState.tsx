import React from 'react';
import { Calendar, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateEvent: () => void;
}

export default function EmptyState({ onCreateEvent }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
        <Calendar className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sự kiện nào</h3>
      <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo sự kiện đầu tiên của bạn</p>
      <button
        onClick={onCreateEvent}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        Tạo sự kiện mới
      </button>
    </div>
  );
}
