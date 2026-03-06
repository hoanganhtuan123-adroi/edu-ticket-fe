import { Calendar, Clock } from 'lucide-react';
import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface RequestInfoCardProps {
  request: SupportRequestDetailResponseDto;
}

export function RequestInfoCard({ request }: RequestInfoCardProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin yêu cầu</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã yêu cầu
            </label>
            <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
              {request.ticketCode}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề
            </label>
            <p className="text-gray-900 font-medium">{request.title}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung chi tiết
            </label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {request.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày tạo
              </label>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(request.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>
            {request.closedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày đóng
                </label>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(request.closedAt).toLocaleString('vi-VN')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
