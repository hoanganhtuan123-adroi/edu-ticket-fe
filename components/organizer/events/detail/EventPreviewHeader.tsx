import React from 'react';
import { Event } from '@/types/event.types';

interface EventPreviewHeaderProps {
  event: Event;
}

export default function EventPreviewHeader({ event }: EventPreviewHeaderProps) {
  return (
    <div className="mb-6 lg:mb-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Xem trước sự kiện</h1>
      <p className="text-gray-600 mt-1 text-sm lg:text-base">
        Kiểm tra lại thông tin sự kiện trước khi gửi phê duyệt
      </p>
    </div>
  );
}
