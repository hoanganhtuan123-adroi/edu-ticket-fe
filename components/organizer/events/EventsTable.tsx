import React from 'react';
import { Calendar, MapPin, Eye, Edit } from 'lucide-react';
import { Event, EventStatus } from '@/types/event.types';

interface EventsTableProps {
  events: Event[];
  onPreview: (slug: string) => void;
  onEdit: (slug: string) => void;
}

export default function EventsTable({ events, onPreview, onEdit }: EventsTableProps) {
  const getStatusColor = (status?: EventStatus | string) => {
    switch (status) {
      case EventStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case EventStatus.PENDING_APPROVAL:
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case EventStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case EventStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case EventStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: EventStatus | string) => {
    switch (status) {
      case EventStatus.DRAFT:
        return 'Nháp';
      case EventStatus.PENDING_APPROVAL:
      case 'PENDING':
        return 'Đang đợi phê duyệt';
      case EventStatus.APPROVED:
        return 'Đã duyệt';
      case EventStatus.CANCELLED:
        return 'Đã bị từ chối';
      case EventStatus.COMPLETED:
        return 'Đã kết thúc';
      default:
        return status || '';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Mobile Card View */}
      <div className="sm:hidden">
        <div className="divide-y divide-gray-200">
          {events.map((event) => (
            <div key={event.id} className="p-4 space-y-3">
              {/* Event Title and Status */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{event.title}</h3>
                  {event.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusColor(event.status)}`}>
                  {getStatusText(event.status)}
                </span>
              </div>
              
              {/* Location and Time */}
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <Calendar className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
                  <span>{formatDate(event.startTime)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onPreview(event.slug || '')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  Xem
                </button>
                <button
                  onClick={() => onEdit(event.slug || '')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-3 h-3" />
                  Sửa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sự kiện
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa điểm
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 lg:px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    {event.description && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(event.startTime)}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-1.5 lg:gap-2">
                    <button
                      onClick={() => onPreview(event.slug || '')}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(event.slug || '')}
                      className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
