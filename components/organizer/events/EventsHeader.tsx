import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface EventsHeaderProps {
  onCreateEvent: () => void;
}

export default function EventsHeader({ onCreateEvent }: EventsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý sự kiện</h1>
        <p className="text-gray-600">Quản lý các sự kiện của bạn</p>
      </div>
      <button
        onClick={onCreateEvent}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        <Plus className="w-5 h-5" />
        Tạo sự kiện mới
      </button>
    </div>
  );
}
