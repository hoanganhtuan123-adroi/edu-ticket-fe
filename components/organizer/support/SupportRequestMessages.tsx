"use client";

import { MessageCircle } from 'lucide-react';
import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface SupportRequestMessagesProps {
  request: SupportRequestDetailResponseDto;
  formatDate: (dateString: string) => string;
}

export default function SupportRequestMessages({ request, formatDate }: SupportRequestMessagesProps) {
  if (!request.messages || request.messages.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tin nhắn trao đổi</h3>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Chưa có tin nhắn trao đổi nào cho yêu cầu này.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tin nhắn trao đổi</h3>
      <div className="space-y-4">
        {request.messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.senderType === 'ADMIN' || message.senderType === 'ORGANIZER'
                ? 'bg-blue-50 border-l-4 border-blue-500'
                : 'bg-gray-50 border-l-4 border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-gray-900">{message.senderName}</span>
                <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {message.senderType === 'ADMIN' ? 'Quản trị viên' : 
                   message.senderType === 'ORGANIZER' ? 'Ban tổ chức' : 'Người gửi'}
                </span>
              </div>
              <span className="text-sm text-gray-500">{formatDate(message.createdAt)}</span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
