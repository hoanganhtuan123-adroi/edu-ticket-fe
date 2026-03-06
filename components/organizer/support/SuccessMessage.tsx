"use client";

import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuccessMessageProps {
  ticketCode: string;
  onNewRequest: () => void;
}

export default function SuccessMessage({ ticketCode, onNewRequest }: SuccessMessageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Yêu cầu hỗ trợ đã được gửi thành công!
          </h1>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <span className="font-medium">Mã ticket:</span>
              <span className="font-mono font-bold text-green-600">{ticketCode}</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-8">
            Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi sớm nhất có thể. 
            Bạn có thể theo dõi trạng thái yêu cầu qua mã ticket trên.
          </p>
          
          <div className="flex space-x-4 justify-center">
            <button
              onClick={onNewRequest}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Gửi yêu cầu khác
            </button>
            <button
              onClick={() => router.push('/organizer/dashboard')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
