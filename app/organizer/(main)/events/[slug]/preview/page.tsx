"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import OrganizerHeader from '@/components/organizer/layout/OrganizerHeader';
import { eventService } from '@/service/organizer/event.service';
import { Event, TicketType, EventDetailResponse } from '@/types/event.types';
import EventPreviewHeader from '@/components/organizer/events/detail/EventPreviewHeader';
import EventStatusBadge from '@/components/organizer/events/detail/EventStatusBadge';
import EventBanner from '@/components/organizer/events/detail/EventBanner';
import EventInfo from '@/components/organizer/events/detail/EventInfo';
import EventTicketTypes from '@/components/organizer/events/detail/EventTicketTypes';
import EventPreviewActions from '@/components/organizer/events/detail/EventPreviewActions';
import { Clock, CheckCircle, XCircle, X, Download } from 'lucide-react';

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const r = Math.round(bytes / Math.pow(k, i) * 100) / 100;
  return `${r} ${sizes[i]}`;
};

const getFileTypeLabel = (fileType: string): string => {
  const typeMap: { [key: string]: string } = {
    'application/pdf': 'PDF',
    'application/msword': 'Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/webp': 'WebP',
  };
  return typeMap[fileType] || fileType;
};

export default function EventPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);

  useEffect(() => {
    fetchEventDetails();
  }, [slug]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventService.getEventDetailForOrganizer(slug);
      if (response.success && response.data) {
        setEvent(response.data);
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
    if (!event || !event.slug) return;
    
    setSubmitting(true);
    
    try {
      const response = await eventService.submitForApproval(event.slug);
      if (response.success) {
        toast.success('Gửi sự kiện phê duyệt thành công!');
        router.push('/organizer/events');
      } else {
        throw new Error(response.message || 'Gửi phê duyệt thất bại');
      }
    } catch (error: any) {
      toast.error(error.message || 'Gửi phê duyệt thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResubmitForApproval = async () => {
    if (!event || !event.slug) return;
    
    setResubmitting(true);
    
    try {
      const response = await eventService.resubmitEventForApproval(event.slug);
      if (response.success) {
        toast.success('Gửi lại sự kiện phê duyệt thành công!');
        router.push('/organizer/events');
      } else {
        throw new Error(response.message || 'Gửi lại phê duyệt thất bại');
      }
    } catch (error: any) {
      toast.error(error.message || 'Gửi lại phê duyệt thất bại');
    } finally {
      setResubmitting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/organizer/events/${slug}/edit`);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <OrganizerHeader />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <EventPreviewHeader event={event} />
          
          {/* Event Status Badge */}
          <div className="mb-6">
            <EventStatusBadge status={event.status} />
          </div>
          
          {/* Event Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Banner Image */}
                <EventBanner event={event} />
                
                {/* Content */}
                <div className="p-6 sm:p-8 lg:p-10 space-y-8">
                  {/* Description */}
                  {event.description && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mô tả sự kiện
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">{event.description}</p>
                    </div>
                  )}
                  
                  {/* Event Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Thông tin chi tiết
                    </h3>
                    <EventInfo event={event} />
                  </div>
                  
                  {/* Ticket Types */}
                  <EventTicketTypes event={event} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Approval History */}
              {event.approvalHistory && event.approvalHistory.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    Lịch sử phê duyệt
                  </h3>
                  <div className="space-y-3">
                    {event.approvalHistory.map((history: any, index: number) => (
                      <div key={history.id} className="bg-white rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {history.action === 'APPROVED' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : history.action === 'REJECTED' ? (
                              <XCircle className="w-4 h-4 text-red-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-blue-600" />
                            )}
                            <span className={`font-medium text-sm ${
                              history.action === 'APPROVED' 
                                ? 'text-green-800' 
                                : history.action === 'REJECTED'
                                ? 'text-red-800'
                                : 'text-blue-800'
                            }`}>
                              {history.action === 'APPROVED' ? 'Đã phê duyệt' : 
                               history.action === 'REJECTED' ? 'Đã bị từ chối' : 'Đã nộp'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(history.createdAt).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        
                        {history.admin && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Người xử lý</p>
                            <p className="text-sm font-medium text-gray-900">
                              {history.admin.fullName || 'Hệ thống'}
                            </p>
                            <p className="text-xs text-gray-600">{history.admin.email}</p>
                          </div>
                        )}
                        
                        {history.reason && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Lý do</p>
                            <p className="text-sm text-gray-700 bg-amber-50 rounded p-2 border border-amber-200">
                              {history.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Attachments */}
              {event.attachments && event.attachments.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 0l6.586-6.586a2 2 0 00-2.828 0l-6.586 6.586a2 2 0 102.828 0l-6.586-6.586a2 2 0 00-2.828 0zM4 10a2 2 0 100-4 2 2 0 012 4z" />
                    </svg>
                    Tài liệu đính kèm
                  </h3>
                  <div className="space-y-3">
                    {event.attachments.map((attachment: any) => (
                      <div key={attachment.id} className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between gap-4">
                          <div 
                            className="flex-1 min-w-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            onClick={() => setSelectedAttachment(attachment)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707L19.586 4.414A1 1 0 0119 3.586V16a1 1 0 01-1 1h-1z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {attachment.fileName}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Kích thước: {formatFileSize(attachment.fileSize)}</span>
                              <span>Loại: {getFileTypeLabel(attachment.fileType)}</span>
                            </div>
                          </div>
                          <a
                            href={`http://localhost:8080${attachment.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-4 h-4" />
                            Tải xuống
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái sự kiện</h3>
                <div className="space-y-3">
                  <EventStatusBadge status={event.status} />
                  <div className="text-sm text-gray-600">
                    <p>Ngày tạo: {new Date(event.createdAt || '').toLocaleDateString('vi-VN')}</p>
                    <p>Cập nhật: {new Date(event.updatedAt || '').toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <EventPreviewActions 
            event={event}
            onEdit={handleEdit}
            onSubmitForApproval={handleSubmitForApproval}
            onResubmitForApproval={handleResubmitForApproval}
            submitting={submitting}
            resubmitting={resubmitting}
          />
        </div>
      </div>
      
      {/* File Preview Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {selectedAttachment.fileName}
                </h3>
                <p className="text-sm text-gray-500">
                  {getFileTypeLabel(selectedAttachment.fileType)} • {formatFileSize(selectedAttachment.fileSize)}
                </p>
              </div>
              <button
                onClick={() => setSelectedAttachment(null)}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              {selectedAttachment.fileType.startsWith('image/') ? (
                // Image preview
                <div className="flex justify-center">
                  <img
                    src={`http://localhost:8080${selectedAttachment.fileUrl}`}
                    alt={selectedAttachment.fileName}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                  />
                </div>
              ) : selectedAttachment.fileType === 'application/pdf' ? (
                // PDF preview
                <div className="flex justify-center">
                  <iframe
                    src={`http://localhost:8080${selectedAttachment.fileUrl}`}
                    className="w-full h-[60vh] rounded-lg border border-gray-200"
                    title={selectedAttachment.fileName}
                  />
                </div>
              ) : selectedAttachment.fileType === 'application/msword' || 
                     selectedAttachment.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                // Word document preview using Google Docs Viewer
                <div className="flex justify-center">
                  <iframe
                    src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(`http://localhost:8080${selectedAttachment.fileUrl}`)}`}
                    className="w-full h-[60vh] rounded-lg border border-gray-200"
                    title={selectedAttachment.fileName}
                  />
                </div>
              ) : selectedAttachment.fileType.includes('text/') || 
                     selectedAttachment.fileType === 'application/json' ||
                     selectedAttachment.fileType.includes('xml') ? (
                // Text file preview
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <iframe
                    src={`http://localhost:8080${selectedAttachment.fileUrl}`}
                    className="w-full h-[60vh] bg-white rounded border border-gray-300 font-mono text-sm"
                    title={selectedAttachment.fileName}
                  />
                </div>
              ) : (
                // Unsupported file type
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707L19.586 4.414A1 1 0 0119 3.586V16a1 1 0 01-1 1h-1z" />
                  </svg>
                  <p className="text-gray-600 mb-4">Loại file này không được hỗ trợ xem trước</p>
                  <a
                    href={`http://localhost:8080${selectedAttachment.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Tải xuống để xem
                  </a>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedAttachment(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <a
                href={`http://localhost:8080${selectedAttachment.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Tải xuống
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
