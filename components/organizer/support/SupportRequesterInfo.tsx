"use client";

import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface SupportRequesterInfoProps {
  request: SupportRequestDetailResponseDto;
}

export default function SupportRequesterInfo({ request }: SupportRequesterInfoProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin người gửi</h3>
      <div className="bg-gray-50 rounded-lg p-4">
        {request.requester ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 text-sm">Họ và tên:</span>
              <p className="font-medium">{request.requester.fullName}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Email:</span>
              <p className="font-medium">{request.requester.email}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Số điện thoại:</span>
              <p className="font-medium">{request.requester.phoneNumber}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Khoa:</span>
              <p className="font-medium">{request.requester.faculty}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">Thông tin người gửi không có sẵn</p>
          </div>
        )}
      </div>
    </div>
  );
}
