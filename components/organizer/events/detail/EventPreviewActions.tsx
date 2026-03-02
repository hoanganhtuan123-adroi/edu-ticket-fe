import React from 'react';
import { Event } from '@/types/event.types';

interface EventPreviewActionsProps {
  event: Event;
  onEdit: () => void;
  onSubmitForApproval: () => void;
  onResubmitForApproval?: () => void;
  resubmitting?: boolean;
  submitting: boolean;
}

export default function EventPreviewActions({ event, onEdit, onSubmitForApproval, onResubmitForApproval, resubmitting, submitting }: EventPreviewActionsProps) {
  return (
    <div className="mt-8 sm:mt-12">
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          type="button"
          onClick={onEdit}
          className="group relative px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300 font-medium text-sm sm:text-base shadow-sm hover:shadow-md"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Chỉnh sửa sự kiện
          </span>
        </button>
        
        {event.status === 'DRAFT' && (
          <button
            type="button"
            onClick={onSubmitForApproval}
            disabled={submitting}
            className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
          >
            <span className="flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi phê duyệt...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Gửi phê duyệt
                </>
              )}
            </span>
          </button>
        )}

        {event.status === 'CANCELLED' && onResubmitForApproval && (
          <button
            type="button"
            onClick={onResubmitForApproval}
            disabled={resubmitting}
            className="group relative px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
          >
            <span className="flex items-center justify-center gap-2">
              {resubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi lại phê duyệt...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Gửi lại phê duyệt
                </>
              )}
            </span>
          </button>
        )}
      </div>
      
      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Lưu ý trước khi gửi phê duyệt:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Kiểm tra kỹ tất cả thông tin sự kiện</li>
              <li>Đảm bảo loại vé và giá cả đã được cấu hình đúng</li>
              <li>Xem lại mô tả và hình ảnh sự kiện</li>
              <li>Sau khi gửi, bạn sẽ không thể chỉnh sửa cho đến khi được phê duyệt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
