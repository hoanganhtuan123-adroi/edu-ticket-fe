"use client";

import { AlertCircle } from 'lucide-react';

export default function SupportInfo() {
  return (
    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-blue-900 mb-2">Lưu ý quan trọng:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Cung cấp thông tin càng chi tiết, chúng tôi càng hỗ trợ nhanh hơn</li>
            <li>• Đính kèm ảnh chụp màn hình nếu có lỗi hiển thị</li>
            <li>• Mỗi yêu cầu sẽ có mã ticket để theo dõi trạng thái</li>
            <li>• Thời gian phản hồi dự kiến: 24-48 giờ</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
