'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useEvent } from '@/hooks/useEvent';
import toast from 'react-hot-toast';
import EventDetail from '@/components/organizer/events/detail/EventDetail';
import EventActions from '@/components/organizer/events/detail/EventActions';

export default function EventDetailPage() {
  const params = useParams();
  const { getEventDetailForOrganizer, loading, error } = useEvent();
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    if (params.slug) {
      loadEventDetail();
    }
  }, [params.slug]);

  const loadEventDetail = async () => {
    try {
      const data = await getEventDetailForOrganizer(params.slug as string);
      if (data) {
        setEventData(data);
      }
    } catch (error: any) {
      toast.error('Không thể tải thông tin sự kiện');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Lỗi: {error}</div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Không tìm thấy sự kiện</div>
      </div>
    );
  }

  return (
    <>
      <EventActions eventData={eventData} />
      <EventDetail eventData={eventData} />
    </>
  );
}
