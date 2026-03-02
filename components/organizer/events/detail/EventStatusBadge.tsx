import React from 'react';
import { Event } from '@/types/event.types';

interface EventStatusBadgeProps {
  status?: string;
}

export default function EventStatusBadge({ status }: EventStatusBadgeProps) {
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
      status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
      status === 'PENDING_APPROVAL' || status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
      status === 'APPROVED' ? 'bg-green-100 text-green-800' :
      status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {status === 'DRAFT' ? 'Nháp' :
       status === 'PENDING_APPROVAL' || status === 'PENDING' ? 'Đang đợi phê duyệt' :
       status === 'APPROVED' ? 'Đã phê duyệt' :
       status === 'CANCELLED' ? 'Đã bị từ chối' :
       status}
    </span>
  );
}
