"use client";

import { Notification } from "@/hooks/admin/useAdminNotifications";
import {
  Bell,
  Trash2,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  selectedNotification: Notification | null;
  onNotificationSelect: (notification: Notification) => void;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  filter: "all" | "unread" | "read";
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

export function NotificationList({
  notifications,
  loading,
  selectedNotification,
  onNotificationSelect,
  onMarkAsRead,
  onDelete,
  filter,
}: NotificationListProps) {
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm min-h-100">
      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Đang tải thông báo...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="p-12 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">Không có thông báo</p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "all"
              ? "Bạn chưa nhận được thông báo nào"
              : filter === "unread"
              ? "Không có thông báo chưa đọc"
              : "Không có thông báo đã đọc"}
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {filteredNotifications.map((notification) => {
            const Icon = typeIcons[notification.type];
            return (
              <div
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedNotification?.id === notification.id
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : "border-l-4 border-transparent"
                } ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                onClick={() => {
                  onNotificationSelect(notification);
                  if (!notification.isRead) {
                    onMarkAsRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeColors[notification.type]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${typeColors[notification.type]}`}
                      >
                        {typeLabels[notification.type]}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                      )}
                    </div>
                    <p className="font-medium text-gray-800 line-clamp-1">
                      {notification.title}
                    </p>
                    <p className="text-gray-600 line-clamp-2 text-sm">
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification.id);
                    }}
                    className="p-2 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
