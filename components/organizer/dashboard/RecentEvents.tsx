"use client";

import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  tickets: {
    sold: number;
    total: number;
  };
}

const recentEvents: Event[] = [
  {
    id: '1',
    name: 'Hội thảo Công nghệ 2024',
    date: '2024-03-15',
    location: 'Hội trường A',
    attendees: 245,
    status: 'upcoming',
    tickets: { sold: 180, total: 300 }
  },
  {
    id: '2',
    name: 'Ngày hội Việc làm',
    date: '2024-03-10',
    location: 'Sân thể thao',
    attendees: 520,
    status: 'ongoing',
    tickets: { sold: 520, total: 600 }
  },
  {
    id: '3',
    name: 'Workshop Kỹ năng mềm',
    date: '2024-03-05',
    location: 'Phòng 301',
    attendees: 85,
    status: 'completed',
    tickets: { sold: 85, total: 100 }
  },
];

const getStatusColor = (status: Event['status']) => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'ongoing':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: Event['status']) => {
  switch (status) {
    case 'upcoming':
      return 'Sắp diễn ra';
    case 'ongoing':
      return 'Đang diễn ra';
    case 'completed':
      return 'Đã kết thúc';
    default:
      return 'Không xác định';
  }
};

export default function RecentEvents() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Sự kiện gần đây</h2>
        <a
          href="/organizer/events"
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Xem tất cả
        </a>
      </div>

      <div className="space-y-4">
        {recentEvents.map((event) => (
          <div
            key={event.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{event.name}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} người tham gia</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-green-600">{event.tickets.sold}</span>
                  <span className="text-gray-400">/{event.tickets.total} vé</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>
                  {Math.round((event.tickets.sold / event.tickets.total) * 100)}% đã bán
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
