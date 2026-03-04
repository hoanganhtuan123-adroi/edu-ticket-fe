"use client";

import { useState, useCallback } from "react";
import { useAdminNotifications, Notification } from "@/hooks/admin/useAdminNotifications";
import {
  Bell,
  Check,
  Trash2,
  Filter,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

type FilterType = "all" | "unread" | "read";

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

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    connected,
  } = useAdminNotifications();
  
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleMarkAsRead = useCallback(async (id: number) => {
    await markAsRead(id);
    if (selectedNotification?.id === id) {
      setSelectedNotification((prev) => prev ? { ...prev, isRead: true } : null);
    }
  }, [markAsRead, selectedNotification]);

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
    if (selectedNotification) {
      setSelectedNotification({ ...selectedNotification, isRead: true });
    }
  }, [markAllAsRead, selectedNotification]);

  const handleDelete = useCallback(async (id: number) => {
    await deleteNotification(id);
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  }, [deleteNotification, selectedNotification]);

  const handleClearAll = useCallback(async () => {
    await clearAll();
    setSelectedNotification(null);
  }, [clearAll]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  return (
    <div className="p-6">
      {/* Header */}
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
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Đánh dấu tất cả đã đọc
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification List */}
        <div className="lg:col-span-2">
          {/* Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <div className="flex gap-2">
                {(["all", "unread", "read"] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filter === f
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {f === "all" && "Tất cả"}
                    {f === "unread" && "Chưa đọc"}
                    {f === "read" && "Đã đọc"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-lg shadow-sm min-h-[400px]">
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
                        setSelectedNotification(notification);
                        if (!notification.isRead) {
                          handleMarkAsRead(notification.id);
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
                            handleDelete(notification.id);
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
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
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
                      onClick={() => handleMarkAsRead(selectedNotification.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Đánh dấu đã đọc
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedNotification.id)}
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
        </div>
      </div>
    </div>
  );
}
