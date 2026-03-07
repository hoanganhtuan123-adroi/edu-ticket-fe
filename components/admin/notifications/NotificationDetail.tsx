"use client";

import { Notification } from "@/hooks/admin/useAdminNotifications";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Check,
  Trash2,
} from "lucide-react";

interface NotificationDetailProps {
  selectedNotification: Notification | null;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const typeColors = {
  info: "bg-blue-100 text-blue-800 border-blue-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  error: "bg-red-100 text-red-800 border-red-200",
};

const typeLabels = {
  info: "Thông tin",
  success: "Thành công",
  warning: "Cảnh báo",
  error: "Lỗi",
};

export function NotificationDetail({
  selectedNotification,
  onMarkAsRead,
  onDelete,
}: NotificationDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Chi tiết thông báo
      </h2>
      {selectedNotification ? (
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-4 ${typeColors[selectedNotification.type]}`}
          >
            {(() => {
              const Icon = typeIcons[selectedNotification.type];
              return <Icon className="w-4 h-4" />;
            })()}
            {typeLabels[selectedNotification.type]}
          </div>
          <p className="font-medium text-gray-800 mb-2">
            {selectedNotification.title}
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {selectedNotification.message}
          </p>
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              <strong>Thời gian:</strong>{" "}
              {new Date(selectedNotification.createdAt).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {selectedNotification.isRead ? (
                <span className="text-green-600">Đã đọc</span>
              ) : (
                <span className="text-blue-600">Chưa đọc</span>
              )}
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            {!selectedNotification.isRead && (
              <button
                onClick={() => onMarkAsRead(selectedNotification.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Đánh dấu đã đọc
              </button>
            )}
            <button
              onClick={() => onDelete(selectedNotification.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Info className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Chọn một thông báo để xem chi tiết</p>
        </div>
      )}
    </div>
  );
}
