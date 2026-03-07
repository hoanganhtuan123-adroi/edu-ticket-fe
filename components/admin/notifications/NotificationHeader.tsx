"use client";

import { Bell } from "lucide-react";

interface NotificationHeaderProps {
  unreadCount: number;
  connected: boolean;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export function NotificationHeader({
  unreadCount,
  connected,
  onMarkAllAsRead,
  onClearAll,
}: NotificationHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            Quản lý thông báo
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {unreadCount} chưa đọc
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            {connected ? (
              <span className="flex items-center gap-2 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Đã kết nối realtime
              </span>
            ) : (
              <span className="flex items-center gap-2 text-gray-500">
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                Mất kết nối
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Xóa tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
