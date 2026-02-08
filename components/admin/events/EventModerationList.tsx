"use client";

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  creator: string;
  tags: string[];
  status: 'pending';
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Hội thảo Công nghệ 2023',
    description: 'Hội thảo về xu hướng công nghệ mới nhất trong năm 2023 với sự tham gia của các chuyên gia hàng đầu.',
    date: '25/10/2023',
    creator: 'Nguyễn Văn A',
    tags: ['Chờ duyệt', 'Công nghệ'],
    status: 'pending'
  },
  {
    id: '2',
    title: 'Workshop Lập trình Web',
    description: 'Workshop hướng dẫn lập trình web cơ bản cho người mới bắt đầu.',
    date: '30/10/2023',
    creator: 'Trần Thị B',
    tags: ['Chờ duyệt', 'Giáo dục'],
    status: 'pending'
  }
];

export default function EventModerationList() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="mb-8">
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Kiểm duyệt sự kiện</h2>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter Button */}
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Lọc</span>
          </button>
        </div>
      </div>

      {/* Event Cards */}
      <div className="space-y-4">
        {mockEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                
                {/* Tags */}
                <div className="flex items-center space-x-2 mb-3">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        tag === 'Chờ duyệt'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Description */}
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                {/* Event Info */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Ngày diễn ra:</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Người tạo:</span>
                    <span>{event.creator}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Duyệt
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Từ chối
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
