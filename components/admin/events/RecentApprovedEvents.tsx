"use client";

import { useState, useEffect } from 'react';
import { adminEventService, AdminEvent } from '@/service/admin/event.service';
import toast from 'react-hot-toast';

export default function RecentApprovedEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

  const fetchApprovedEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminEventService.getAllEvents({
        status: 'APPROVED',
        limit: 10,
        offset: 0
      });
      
      if (response.success) {
        setEvents(response.data.data);
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Không thể tải danh sách sự kiện đã duyệt';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sự kiện đã duyệt gần đây</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sự kiện đã duyệt gần đây</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchApprovedEvents}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Sự kiện đã duyệt gần đây</h2>
      
      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Chưa có sự kiện nào được duyệt gần đây</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tên sự kiện</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Người tổ chức</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Ngày diễn ra</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Ngày duyệt</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      {event.categoryName && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mt-1">
                          {event.categoryName}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <p className="font-medium">{event.organizer?.fullName || event.organizer?.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(event.startTime)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Đã duyệt
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(event.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
