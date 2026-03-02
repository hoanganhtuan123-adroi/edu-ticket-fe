"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import OrganizerHeader from '@/components/organizer/layout/OrganizerHeader';
import TicketTypeManager from '@/components/organizer/events/create/TicketTypeManager';
import { useEvent } from '@/hooks/useEvent';
import { useCategory } from '@/hooks/useCategory';
import { CreateEventDto, CreateTicketDto } from '@/types/event.types';


// Import new components
import EventFormHeader from '@/components/organizer/events/create/EventFormHeader';
import BasicInfoForm from '@/components/organizer/events/create/BasicInfoForm';
import BannerUpload from '@/components/organizer/events/create/BannerUpload';
import AttachmentUpload from '@/components/organizer/events/create/AttachmentUpload';
import FormActions from '@/components/organizer/events/create/FormActions';

export default function CreateEventPage() {
  const router = useRouter();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  
  // Use hooks
  const { createEvent, loading: eventLoading } = useEvent();
  const { categories, loading: loadingCategories, error: categoriesError } = useCategory();
  
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
    // Categories are automatically fetched by useCategory hook
  }, []);

  const handleInputChange = (field: keyof CreateEventDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 10MB');
      return;
    }

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)$/)) {
      toast.error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp)');
      return;
    }

    setBannerFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setBannerPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  const handleTicketTypesChange = (ticketTypes: CreateTicketDto[]) => {
    setFormData(prev => ({ ...prev, ticketTypes }));
  };

  const handleAttachmentsChange = (newAttachments: any[]) => {
    setAttachments(newAttachments);
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
      return 'Phải có ít nhất một loại vé';
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
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form fields
      submitData.append('categoryId', formData.categoryId.toString());
      submitData.append('title', formData.title);
      if (formData.description) {
        submitData.append('description', formData.description);
      }
      submitData.append('location', formData.location);
      
      // Convert datetime-local to ISO8601 format
      const startTimeISO = formData.startTime ? new Date(formData.startTime).toISOString() : '';
      const endTimeISO = formData.endTime ? new Date(formData.endTime).toISOString() : '';
      
      submitData.append('startTime', startTimeISO);
      submitData.append('endTime', endTimeISO);
      
      // Add banner file if provided
      if (bannerFile) {
        submitData.append('banner', bannerFile);
      }
      
      // Add attachment files if provided
      attachments.forEach((attachment) => {
        submitData.append('attachments', attachment.file);
      });
      
      // Add ticket types as JSON string
      if (formData.ticketTypes && formData.ticketTypes.length > 0) {
        submitData.append('ticketTypes', JSON.stringify(formData.ticketTypes));
      }
      
      // Add settings if exists
      if (formData.settings) {
        submitData.append('settings', typeof formData.settings === 'string' 
          ? formData.settings 
          : JSON.stringify(formData.settings)
        );
      }
      
      const success = await createEvent(submitData);
      
      if (success) {
        toast.success('Tạo sự kiện thành công! Đang chuyển hướng...');
        
        setTimeout(() => {
          router.push('/organizer/events');
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Tạo sự kiện thất bại. Vui lòng thử lại.');
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề sự kiện để lưu nháp');
      return;
    }
    
    try {
      const success = await createEvent(formData);
      
      if (success) {
        toast.success('Lưu nháp thành công!');
        
        setTimeout(() => {
          router.push('/organizer/events');
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Lưu nháp thất bại. Vui lòng thử lại.');
    }
  };

  if (loadingCategories) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <OrganizerHeader />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <EventFormHeader
            title="Tạo sự kiện mới"
            description="Điền thông tin chi tiết để tạo sự kiện mới. Sự kiện sẽ được lưu dưới dạng nháp và bạn có thể gửi phê duyệt sau."
          />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <BasicInfoForm
              formData={formData}
              categories={categories}
              loadingCategories={loadingCategories}
              onInputChange={handleInputChange}
            />
            
            <BannerUpload
              bannerFile={bannerFile}
              bannerPreview={bannerPreview}
              onBannerChange={handleBannerChange}
              onRemoveBanner={handleRemoveBanner}
            />
            
            <AttachmentUpload
              attachments={attachments}
              onAttachmentsChange={handleAttachmentsChange}
            />
            
            <TicketTypeManager
              ticketTypes={formData.ticketTypes || []}
              onTicketTypesChange={handleTicketTypesChange}
            />
            
            <FormActions
              loading={eventLoading}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
