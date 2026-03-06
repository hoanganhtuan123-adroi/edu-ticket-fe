"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useAdminSupport } from '@/hooks/admin/useAdminSupport';
import { SupportRequestDetailResponseDto } from '@/types/support.types';

// Import components
import { SupportDetailHeader } from '@/components/admin/support/detail/SupportDetailHeader';
import { RequestInfoCard } from '@/components/admin/support/detail/RequestInfoCard';
import { AttachmentsCard } from '@/components/admin/support/detail/AttachmentsCard';
import { MessagesCard } from '@/components/admin/support/detail/MessagesCard';
import { RequesterInfoCard } from '@/components/admin/support/detail/RequesterInfoCard';
import { ActionsCard } from '@/components/admin/support/detail/ActionsCard';

export default function SupportRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getSupportRequestById } = useAdminSupport();
  
  const [request, setRequest] = useState<SupportRequestDetailResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ticketCode = params.ticketCode as string;

  useEffect(() => {
    const loadRequest = async () => {
      if (!ticketCode) {
        console.log('No ticketCode provided');
        return;
      }
      
      console.log('Loading request for ticketCode:', ticketCode);
      setIsLoading(true);
      try {
        const data = await getSupportRequestById(ticketCode);
        console.log('Received data:', data);
        if (data) {
          setRequest(data);
        } else {
          setError('Không tìm thấy yêu cầu hỗ trợ');
        }
      } catch (err: any) {
        console.error('Error loading request:', err);
        setError(err.message || 'Không thể tải thông tin yêu cầu');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequest();
  }, [ticketCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Không tìm thấy yêu cầu hỗ trợ'}
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <SupportDetailHeader request={request} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Info Card */}
            <RequestInfoCard request={request} />

            {/* Attachments Card */}
            <AttachmentsCard attachments={request.attachments} />

            {/* Messages Card */}
            <MessagesCard messages={request.messages} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requester Info Card */}
            <RequesterInfoCard requester={request.requester} />

            {/* Actions Card */}
            <ActionsCard onBack={() => router.back()} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
