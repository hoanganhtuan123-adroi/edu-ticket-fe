"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import OrganizerHeader from '@/components/organizer/layout/OrganizerHeader';
import TicketTypeManager from '@/components/organizer/events/TicketTypeManager';
import { eventService } from '@/service/organizer/event.service';
import { CreateEventDto, CreateTicketDto, Category, Event } from '@/types/event.types';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  
  const [formData, setFormData] = useState<CreateEventDto>({
    categoryId: 0,
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    ticketTypes: [],
  });

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      // Fetch event details
      const eventResponse = await eventService.getEventById(eventId);
      if (eventResponse.success && eventResponse.data?.event) {
        const eventData = eventResponse.data.event;
        setEvent(eventData);
        
        // Set form data
        setFormData({
          categoryId: eventData.categoryId,
          title: eventData.title,
          description: eventData.description || '',
          location: eventData.location,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          ticketTypes: eventData.ticketTypes || [],
        });
      } else {
        throw new Error(eventResponse.message || 'Không thể tải thông tin sự kiện');
      }
      
      // Fetch categories
      const categoriesResponse = await eventService.getCategories();
      if (categoriesResponse.success && categoriesResponse.data?.categories) {
        setCategories(categoriesResponse.data.categories);
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải thông tin sự kiện');
      router.push('/organizer/events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateEventDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTicketTypesChange = (ticketTypes: CreateTicketDto[]) => {
    setFormData(prev => ({ ...prev, ticketTypes }));
  };

  const validateForm = (): string | null => {
    if (!formData.categoryId) {
      return 'Vui lòng chọn danh mục sự kiện';
    }
    
    if (!formData.title.trim()) {
      return 'Vui lòng nhập tiêu đề sự kiện';
    }
    
    if (!formData.location.trim()) {
      return 'Vui lòng nhập địa điểm tổ chức';
    }
    
    if (!formData.startTime) {
      return 'Vui lòng chọn thời gian bắt đầu';
    }
    
    if (!formData.endTime) {
      return 'Vui lòng chọn thời gian kết thúc';
    }
    
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      return 'Thời gian kết thúc phải sau thời gian bắt đầu';
    }
    
    if (!formData.ticketTypes || formData.ticketTypes.length === 0) {
      return 'Vui lòng thêm ít nhất một loại vé';
    }
    
    // Validate ticket types
    for (const ticket of formData.ticketTypes) {
      if (!ticket.name.trim()) {
        return 'Vui lòng nhập tên cho tất cả các loại vé';
      }
      if (ticket.price < 0) {
        return 'Giá vé không được âm';
      }
      if (ticket.quantityLimit <= 0) {
        return 'Số lượng giới hạn phải lớn hơn 0';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await eventService.updateEvent(eventId, formData);
      
      if (response.success && response.data?.event) {
        toast.success('Cập nhật sự kiện thành công! Đang chuyển hướng...');
        
        setTimeout(() => {
          router.push(`/organizer/events/${eventId}/preview`);
        }, 1500);
      } else {
        throw new Error(response.message || 'Cập nhật sự kiện thất bại');
      }
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật sự kiện thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
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

  // Check if event can be edited (only DRAFT status)
  if (event.status !== 'DRAFT') {
    return (
      <div className="min-h-screen bg-gray-50">
        <OrganizerHeader />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                Không thể chỉnh sửa sự kiện
              </h2>
              <p className="text-yellow-700 mb-4">
                Sự kiện này đang ở trạng thái "{event.status}" và không thể chỉnh sửa. 
                Chỉ các sự kiện ở trạng thái "Nháp" mới có thể được chỉnh sửa.
              </p>
              <button
                onClick={() => router.push(`/organizer/events/${eventId}/preview`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Xem sự kiện
              </button>
            </div>
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Chỉnh sửa sự kiện</h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Cập nhật thông tin sự kiện của bạn
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cơ bản</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục sự kiện *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề sự kiện *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề sự kiện"
                    maxLength={255}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả sự kiện
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Mô tả chi tiết về sự kiện của bạn..."
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm tổ chức *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập địa điểm tổ chức sự kiện"
                  maxLength={255}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian bắt đầu *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian kết thúc *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={formData.startTime}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Ticket Types */}
            <TicketTypeManager
              ticketTypes={formData.ticketTypes || []}
              onTicketTypesChange={handleTicketTypesChange}
            />
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.push(`/organizer/events/${eventId}/preview`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
