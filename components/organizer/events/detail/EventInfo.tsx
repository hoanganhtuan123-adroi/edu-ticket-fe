import React from 'react';
import { Event } from '@/types/event.types';

interface EventInfoProps {
  event: Event;
}

export default function EventInfo({ event }: EventInfoProps) {
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const infoItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Địa điểm',
      value: event.location,
      color: 'red'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Thời gian bắt đầu',
      value: event.startTime ? formatDateTime(event.startTime) : 'Chưa xác định',
      color: 'blue'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Thời gian kết thúc',
      value: event.endTime ? formatDateTime(event.endTime) : 'Chưa xác định',
      color: 'green'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Ngày tạo',
      value: event.createdAt ? formatDateTime(event.createdAt) : 'Chưa xác định',
      color: 'purple'
    }
  ];

  if (event.organizer) {
    infoItems.push({
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Người tổ chức',
      value: event.organizer.email,
      color: 'indigo'
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {infoItems.map((item, index) => (
        <div key={index} className="group relative overflow-hidden bg-white rounded-xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50"></div>
          
          <div className="relative">
            <div className={`inline-flex p-3 rounded-xl bg-${item.color}-50 text-${item.color}-600 mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{item.label}</h4>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
