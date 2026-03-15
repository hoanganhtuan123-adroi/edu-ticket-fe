"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import TicketTypeManager from '@/components/organizer/events/create/TicketTypeManager';
import { useOrganizerEvents } from '@/hooks/organizer/useOrganizerEvents';
import { useCategories } from '@/hooks/organizer/useCategories';
import { CreateEventDto, CreateTicketDto } from '@/types/event.types';

// Import new components
import BasicInfoForm from '@/components/organizer/events/create/BasicInfoForm';
import BannerUpload from '@/components/organizer/events/create/BannerUpload';
import AttachmentUpload from '@/components/organizer/events/create/AttachmentUpload';
import FormActions from '@/components/organizer/events/create/FormActions';
import AdditionalInfoForm, { AdditionalInfo } from '@/components/organizer/events/create/AdditionalInfoForm';
import TicketSaleTimeForm from '@/components/organizer/events/create/TicketSaleTimeForm';
import CheckInStaffSelector from '@/components/organizer/events/create/CheckInStaffSelector';
import { useOrganizerUsers } from '@/hooks/organizer/useOrganizerUsers';
import { SystemRole } from '@/service/organizer/user.service';

export default function CreateEventPage() {
  const router = useRouter();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [speakerAvatarFiles, setSpeakerAvatarFiles] = useState<{ [key: number]: File }>({});
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    speakers: [{ name: '', title: '', bio: '' }],
    targetAudience: ''
  });
  const [selectedCheckInStaff, setSelectedCheckInStaff] = useState<any[]>([]);
  const [transformedUsers, setTransformedUsers] = useState<any[]>([]);
  
  // Centralized toast notification handlers
  const showSuccessToast = (message: string) => toast.success(message);
  const showErrorToast = (message: string) => toast.error(message);
  
  // Use hooks
  const { createEvent, isLoading: eventLoading } = useOrganizerEvents();
  const { categories, loading: loadingCategories, error: categoriesError } = useCategories();
  const { users, loading: loadingUsers, error: usersError, fetchUsers } = useOrganizerUsers({
    role: SystemRole.USER,
    limit: 100,
  });

  // Transform users data and fetch on mount
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array - only call once on mount

  // Transform API users to component format
  useEffect(() => {
    const transformed = users.map(user => ({
      id: user.id,
      name: user.fullName,
      studentCode: user.email, // Use email instead of studentCode
      isSelected: false,
    }));
    setTransformedUsers(transformed);
  }, [users]);

  // Show toast notification when usersError occurs
  useEffect(() => {
    if (usersError) {
      showErrorToast(usersError);
    }
  }, [usersError]);

  // Update formData checkInStaff when selection changes
  useEffect(() => {
    const checkInStaff = selectedCheckInStaff.map(staff => ({
      userId: staff.id,
      staffRole: 'CHECKER'
    }));
    setFormData(prev => ({ ...prev, checkInStaff }));
  }, [selectedCheckInStaff]);
  
  const [formData, setFormData] = useState<CreateEventDto>({
    categoryId: 0,
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    startSaleTime: '',
    endSaleTime: '',
    ticketTypes: [],
    checkInStaff: [],
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
      showErrorToast('Kích thước file không được vượt quá 10MB');
      return;
    }

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)$/)) {
      showErrorToast('Chỉ chấp nhận file ảnh (jpg, png, gif, webp)');
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

  const handleSpeakerAvatarChange = (speakerIndex: number, file: File | null) => {
    setSpeakerAvatarFiles(prev => {
      const newFiles = { ...prev };
      if (file) {
        newFiles[speakerIndex] = file;
      } else {
        delete newFiles[speakerIndex];
      }
      return newFiles;
    });
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
    
    if (!formData.startSaleTime) {
      return 'Vui lòng chọn thời gian bắt đầu bán vé';
    }
    
    if (!formData.endSaleTime) {
      return 'Vui lòng chọn thời gian kết thúc bán vé';
    }
    
    if (new Date(formData.startSaleTime) >= new Date(formData.endSaleTime)) {
      return 'Thời gian kết thúc bán vé phải sau thời gian bắt đầu bán vé';
    }
    
    if (formData.ticketTypes && formData.ticketTypes.length > 0) {
      if (new Date(formData.startSaleTime) >= new Date(formData.startTime)) {
        return 'Thời gian bắt đầu bán vé phải trước thời gian bắt đầu sự kiện';
      }
      
      if (new Date(formData.endSaleTime) > new Date(formData.endTime)) {
        return 'Thời gian kết thúc bán vé không được sau thời gian kết thúc sự kiện';
      }
    }
    
    if (!formData.ticketTypes || formData.ticketTypes.length === 0) {
      return 'Phải có ít nhất một loại vé';
    }
    
    // Validate ticket types
    for (const ticket of formData.ticketTypes) {
      if (!ticket.name.trim()) {
        return 'Vui lòng nhập tên cho tất cả các loại vé';
      }
      
      // Check price validation based on ticket type
      if (ticket.type === 'FREE') {
        if (ticket.price !== 0) {
          return 'Vé miễn phí phải có giá là 0';
        }
      } else {
        // For REGULAR and VIP
        if (ticket.price <= 0) {
          return 'Vé thường và VIP phải có giá lớn hơn 0';
        }
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
      showErrorToast(validationError);
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
      const startSaleTimeISO = formData.startSaleTime ? new Date(formData.startSaleTime).toISOString() : '';
      const endSaleTimeISO = formData.endSaleTime ? new Date(formData.endSaleTime).toISOString() : '';
      
      submitData.append('startTime', startTimeISO);
      submitData.append('endTime', endTimeISO);
      submitData.append('startSaleTime', startSaleTimeISO);
      submitData.append('endSaleTime', endSaleTimeISO);
      
      // Add banner file if provided
      if (bannerFile) {
        submitData.append('banner', bannerFile);
      }
      
      // Add attachment files if provided
      attachments.forEach((attachment) => {
        submitData.append('attachments', attachment.file);
      });
      
      // Add speaker avatar files if provided
      Object.entries(speakerAvatarFiles).forEach(([speakerIndex, file]) => {
        submitData.append(`speakerAvatars`, file);
        submitData.append(`speakerAvatarIndex`, speakerIndex);
      });
      
      // Add ticket types as JSON string (ensure no id fields are included)
      if (formData.ticketTypes && formData.ticketTypes.length > 0) {
        const cleanedTicketTypes = formData.ticketTypes.map((ticket: any) => {
          const { id, ...cleanedTicket } = ticket;
          // Add common sale times to each ticket
          return {
            ...cleanedTicket,
            startSaleTime: startSaleTimeISO,
            endSaleTime: endSaleTimeISO
          };
        });
        submitData.append('ticketTypes', JSON.stringify(cleanedTicketTypes));
      }
      
      // Add check-in staff as JSON string
      if (formData.checkInStaff && formData.checkInStaff.length > 0) {
        submitData.append('checkInStaff', JSON.stringify(formData.checkInStaff));
      }
      
      // Add settings only if additional info section is shown and has data
      if (showAdditionalInfo) {
        const settings = {
          ...additionalInfo,
          // Filter out empty values to keep settings clean
          speakers: additionalInfo.speakers.filter(s => s.name.trim()),
          targetAudience: additionalInfo.targetAudience?.trim() || undefined
        };
        
        // Only add settings if there's actual data
        const hasData = settings.speakers.length > 0 || settings.targetAudience;
        
        if (hasData) {
          submitData.append('settings', JSON.stringify(settings));
        }
      }
      
      await createEvent(submitData);
      
      showSuccessToast('Tạo sự kiện thành công! Đang chuyển hướng...');
      
      setTimeout(() => {
        router.push('/organizer/events');
      }, 1500);
    } catch (error: any) {
      showErrorToast(error.message || 'Tạo sự kiện thất bại. Vui lòng thử lại.');
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      showErrorToast('Vui lòng nhập tiêu đề sự kiện để lưu nháp');
      return;
    }
    
    try {
      // Ensure no id fields are included in ticket types
      const cleanedFormData = {
        ...formData,
        ticketTypes: formData.ticketTypes?.map((ticket: any) => {
          const { id, ...cleanedTicket } = ticket;
          return cleanedTicket;
        }) || []
      };
      
      await createEvent(cleanedFormData);
      
      showSuccessToast('Lưu nháp thành công!');
      
      setTimeout(() => {
        router.push('/organizer/events');
      }, 1500);
    } catch (error: any) {
      showErrorToast(error.message || 'Lưu nháp thất bại. Vui lòng thử lại.');
    }
  };

  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Tạo sự kiện mới</h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Điền thông tin chi tiết để tạo sự kiện mới. Sự kiện sẽ được lưu dưới dạng nháp và bạn có thể gửi phê duyệt sau.
            </p>
          </div>
          
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
            
            {/* Optional Additional Info Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Thông tin bổ sung (Không bắt buộc)</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Thêm thông tin diễn giả, điều kiện tham gia, tài liệu cần chuẩn bị...
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                  className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {showAdditionalInfo ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
              
              {showAdditionalInfo && (
                <div className="mt-6">
                  <AdditionalInfoForm
                    data={additionalInfo}
                    onChange={setAdditionalInfo}
                    onSpeakerAvatarChange={handleSpeakerAvatarChange}
                  />
                </div>
              )}
            </div>
            
            <AttachmentUpload
              attachments={attachments}
              onAttachmentsChange={handleAttachmentsChange}
            />
            
            <TicketSaleTimeForm
              startSaleTime={formData.startSaleTime || ''}
              endSaleTime={formData.endSaleTime || ''}
              onStartTimeChange={(time) => handleInputChange('startSaleTime', time)}
              onEndTimeChange={(time) => handleInputChange('endSaleTime', time)}
            />
            
            <TicketTypeManager
              ticketTypes={formData.ticketTypes || []}
              onTicketTypesChange={handleTicketTypesChange}
            />
            
            <CheckInStaffSelector
              selectedStaff={selectedCheckInStaff}
              onStaffChange={setSelectedCheckInStaff}
              users={transformedUsers}
              loading={loadingUsers}
              error={usersError}
              onRetry={fetchUsers}
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
