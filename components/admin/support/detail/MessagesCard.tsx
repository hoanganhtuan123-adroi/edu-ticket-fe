import { FileText } from 'lucide-react';
import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface MessagesCardProps {
  messages: SupportRequestDetailResponseDto['messages'];
}

export function MessagesCard({ messages }: MessagesCardProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <FileText className="w-5 h-5 inline mr-2" />
          Lịch sử trao đổi ({messages?.length || 0})
        </h2>
        
        {messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <p className="text-sm text-gray-900">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.senderName} • {new Date(message.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Chưa có trao đổi nào
          </p>
        )}
      </div>
    </div>
  );
}
