"use client";

import { Copy } from 'lucide-react';
import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface SupportRequestDetailsProps {
  request: SupportRequestDetailResponseDto;
  onCopyTicketCode: (ticketCode: string) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
  formatDate: (dateString: string) => string;
}

export default function SupportRequestDetails({
  request,
  onCopyTicketCode,
  getStatusColor,
  getStatusIcon,
  getStatusText,
  formatDate,
}: SupportRequestDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin chung</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Mã yêu cầu:</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">{request.ticketCode}</span>
              <button
                onClick={() => onCopyTicketCode(request.ticketCode)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Sao chép mã yêu cầu"
              >
                <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày tạo:</span>
            <span className="font-medium">{formatDate(request.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cập nhật lần cuối:</span>
            <span className="font-medium">{formatDate(request.updatedAt)}</span>
          </div>
          {request.closedAt && (
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày đóng:</span>
              <span className="font-medium">{formatDate(request.closedAt)}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Trạng thái</h3>
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          <span className="font-medium">{getStatusText(request.status)}</span>
        </div>
      </div>
    </div>
  );
}
