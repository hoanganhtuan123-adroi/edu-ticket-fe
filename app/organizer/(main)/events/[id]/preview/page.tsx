"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import OrganizerHeader from '@/components/organizer/layout/OrganizerHeader';
import { eventService } from '@/service/organizer/event.service';
import { Event, TicketType, Category } from '@/types/event.types';

export default function EventPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventService.getEventById(eventId);
      if (response.success && response.data?.event) {
        setEvent(response.data.event);
        
        // Fetch category details
        const categoriesResponse = await eventService.getCategories();
        if (categoriesResponse.success && categoriesResponse.data?.categories) {
          const eventCategory = categoriesResponse.data.categories.find(
            cat => cat.id === response.data!.event.categoryId
          );
          setCategory(eventCategory || null);
        }
      } else {
        throw new Error(response.message || 'Không thể tải thông tin sự kiện');
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải thông tin sự kiện');
      router.push('/organizer/events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!event) return;
    
    setSubmitting(true);
    
    try {
      const response = await eventService.submitForApproval(eventId);
      
      if (response.success) {
        toast.success('Gửi sự kiện phê duyệt thành công! Đang chuyển hướng...');
        
        setTimeout(() => {
          router.push('/organizer/events');
        }, 1500);
      } else {
        throw new Error(response.message || 'Gửi phê duyệt thất bại');
      }
    } catch (error: any) {
      toast.error(error.message || 'Gửi phê duyệt thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/organizer/events/${eventId}/edit`);
  };

  const getTicketTypeLabel = (type: TicketType) => {
    const labels = {
      [TicketType.REGULAR]: 'Thường',
      [TicketType.VIP]: 'VIP',
      [TicketType.EARLY_BIRD]: 'Early Bird',
      [TicketType.STUDENT]: 'Sinh viên',
      [TicketType.GROUP]: 'Nhóm',
      [TicketType.SPONSOR]: 'Nhà tài trợ',
      [TicketType.FREE]: 'Miễn phí',
    };
    return labels[type] || type;
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OrganizerHeader />
        <div className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OrganizerHeader />
        <div className="p-8">
          <div className="text-center">
            <p className="text-gray-500">Không tìm thấy sự kiện</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OrganizerHeader />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Xem trước sự kiện</h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Kiểm tra lại thông tin sự kiện trước khi gửi phê duyệt
            </p>
          </div>
          
          {/* Event Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              event.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
              event.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
              event.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {event.status === 'DRAFT' ? 'Nháp' :
               event.status === 'PENDING' ? 'Chờ phê duyệt' :
               event.status === 'APPROVED' ? 'Đã phê duyệt' :
               event.status}
            </span>
          </div>
          
          {/* Event Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              {category && (
                <p className="text-blue-100">Danh mục: {category.name}</p>
              )}
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              {event.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả sự kiện</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
              
              {/* Event Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Địa điểm</h4>
                  <p className="text-gray-600">{event.location}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Thời gian bắt đầu</h4>
                  <p className="text-gray-600">{formatDateTime(event.startTime)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Thời gian kết thúc</h4>
                  <p className="text-gray-600">{formatDateTime(event.endTime)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Ngày tạo</h4>
                  <p className="text-gray-600">{formatDateTime(event.createdAt)}</p>
                </div>
              </div>
              
              {/* Ticket Types */}
              {event.ticketTypes && event.ticketTypes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Loại vé sự kiện</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên loại vé
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại vé
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá vé
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số lượng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mô tả
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {event.ticketTypes.map((ticket, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {ticket.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {ticket.type ? getTicketTypeLabel(ticket.type) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {ticket.price === 0 ? 'Miễn phí' : formatCurrency(ticket.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {ticket.quantityLimit}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {ticket.description || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleEdit}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Chỉnh sửa
            </button>
            
            {event.status === 'DRAFT' && (
              <button
                type="button"
                onClick={handleSubmitForApproval}
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang gửi...' : 'Gửi phê duyệt'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
