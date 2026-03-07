"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Head from 'next/head';
import { ArrowLeft, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useOrganizerSupport } from '@/hooks/organizer/useOrganizerSupport';
import { SupportRequestDetailResponseDto } from '@/types/support.types';
import SupportRequestHeader from '@/components/organizer/support/SupportRequestHeader';
import SupportRequestDescription from '@/components/organizer/support/SupportRequestDescription';
import SupportRequestAttachments from '@/components/organizer/support/SupportRequestAttachments';
import SupportRequestDetails from '@/components/organizer/support/SupportRequestDetails';
import SupportRequestMessages from '@/components/organizer/support/SupportRequestMessages';

export default function SupportRequestDetailPage() {
  const router = useRouter();
  const { getSupportRequestById } = useOrganizerSupport();
  
  const [request, setRequest] = useState<SupportRequestDetailResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const ticketCode = pathSegments[pathSegments.length - 1];
    if (ticketCode) {
      loadRequestDetail(ticketCode);
    }
  }, []);

  const loadRequestDetail = async (ticketCode: string) => {
    setIsLoading(true);
    try {
      const response = await getSupportRequestById(ticketCode);
      if (response?.success && response.data) {
        setRequest(response.data);
      }
    } catch (error) {
      console.error('Failed to load request detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'Mở';
      case 'IN_PROGRESS':
        return 'Đang xử lý';
      case 'RESOLVED':
        return 'Đã giải quyết';
      case 'CLOSED':
        return 'Đã đóng';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return <AlertCircle className="w-5 h-5" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5" />;
      case 'RESOLVED':
        return <CheckCircle className="w-5 h-5" />;
      case 'CLOSED':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const formatFileSize = (size: string) => {
    const bytes = parseInt(size);
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('docx')) return '📝';
    if (mimeType.includes('image')) return '🖼️';
    return '📎';
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyTicketCode = async (ticketCode: string) => {
    try {
      await navigator.clipboard.writeText(ticketCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy ticket code:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy yêu cầu hỗ trợ</h2>
          <p className="text-gray-600 mb-6">Mã yêu cầu hỗ trợ này không tồn tại hoặc bạn không có quyền truy cập.</p>
          <button
            onClick={() => router.push('/organizer/support/requests')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{request ? `Yêu cầu hỗ trợ ${request.ticketCode} - ${request.title}` : 'Chi tiết yêu cầu hỗ trợ'}</title>
        <meta name="description" content={request ? `Xem chi tiết yêu cầu hỗ trợ ${request.ticketCode}` : 'Chi tiết yêu cầu hỗ trợ'} />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/organizer/support/requests')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          {/* Request Header */}
          <SupportRequestHeader
            request={request}
            onCopyTicketCode={handleCopyTicketCode}
            copied={copied}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            getStatusText={getStatusText}
            formatDate={formatDate}
          />

          {/* Request Content */}
          <div className="p-6 space-y-8">
            {/* Description */}
            <SupportRequestDescription request={request} />

            {/* Attachments */}
            <SupportRequestAttachments
              request={request}
              onDownloadFile={handleDownloadFile}
              formatFileSize={formatFileSize}
              getFileIcon={getFileIcon}
              formatDate={formatDate}
            />

            {/* Request Details */}
            <SupportRequestDetails
              request={request}
              onCopyTicketCode={handleCopyTicketCode}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              getStatusText={getStatusText}
              formatDate={formatDate}
            />

            {/* Messages */}
            <SupportRequestMessages
              request={request}
              formatDate={formatDate}
            />
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
