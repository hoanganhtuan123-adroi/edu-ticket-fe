"use client";

import { useState, useEffect, useCallback } from "react";
import { useOrganizerNotifications } from "@/hooks/organizer/useOrganizerNotifications";
import {
  Bell,
  Check,
  X,
  Info,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const typeColors = {
  info: "from-blue-400 to-blue-600",
  success: "from-green-400 to-green-600",
  warning: "from-yellow-400 to-yellow-600",
  error: "from-red-400 to-red-600",
};

const typeBgColors = {
  info: "bg-blue-50 border-blue-100",
  success: "bg-green-50 border-green-100",
  warning: "bg-yellow-50 border-yellow-100",
  error: "bg-red-50 border-red-100",
};

export function OrganizerNotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getNotifications,
    connected,
  } = useOrganizerNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Refetch when dropdown opens
  useEffect(() => {
    if (isOpen) {
      getNotifications();
    }
  }, [isOpen, getNotifications]);

  const handleMarkAsRead = useCallback(
    async (id: number) => {
      await markAsRead(id);
    },
    [markAsRead],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteNotification(id);
    },
    [deleteNotification],
  );

  const handleClearAll = useCallback(async () => {
    await clearAll();
  }, [clearAll]);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full hover:bg-gray-100/80 transition-all duration-200 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 15 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Bell className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors" />
        </motion.div>

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-5 h-5 bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-lg"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        {!connected && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-gray-400 rounded-full" />
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100/50 z-50 max-h-125 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100/50 bg-linear-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">Thông báo</h3>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {unreadCount} mới
                  </motion.span>
                )}
              </div>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleMarkAllAsRead}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    title="Đánh dấu tất cả đã đọc"
                  >
                    <Check className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-87.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center text-gray-500"
                >
                  <Loader2 className="w-8 h-8 mx-auto mb-3 text-blue-500 animate-spin" />
                  <p className="text-sm font-medium">Đang tải thông báo...</p>
                </motion.div>
              ) : notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center text-gray-500"
                >
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium">Chưa có thông báo</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Bạn sẽ nhận được thông báo ở đây
                  </p>
                </motion.div>
              ) : (
                notifications.map((notification, index) => {
                  const Icon = typeIcons[notification.type];
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`p-4 border-b border-gray-50/50 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer ${
                        notification.isRead
                          ? "opacity-70"
                          : "bg-blue-50/20 border-l-2 border-l-blue-400"
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`w-10 h-10 rounded-xl bg-linear-to-br ${
                            typeColors[notification.type]
                          } text-white flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  day: "2-digit",
                                  month: "2-digit",
                                },
                              )}
                            </p>
                            {!notification.isRead && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 text-xs text-blue-600 font-medium"
                              >
                                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                Mới
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 border-t border-gray-100/50 bg-linear-to-r from-gray-50 to-white flex justify-between items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearAll}
                  className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  Xóa tất cả
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/organizer/notifications"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1"
                >
                  Xem tất cả
                  <span className="text-xs">→</span>
                </motion.a>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
