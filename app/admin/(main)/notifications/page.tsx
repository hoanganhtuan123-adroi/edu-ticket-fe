"use client";

import { useState, useCallback } from "react";
import { useAdminNotifications, Notification } from "@/hooks/admin/useAdminNotifications";
import { NotificationHeader } from "@/components/admin/notifications/NotificationHeader";
import { NotificationFilter } from "@/components/admin/notifications/NotificationFilter";
import { NotificationList } from "@/components/admin/notifications/NotificationList";
import { NotificationDetail } from "@/components/admin/notifications/NotificationDetail";
import { Pagination } from "@/components/admin/notifications/Pagination";

type FilterType = "all" | "unread" | "read";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    pagination,
    handlePageChange,
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

  const handleNotificationSelect = useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  }, [handleMarkAsRead]);

  return (
    <div className="p-6">
      {/* Header */}
      <NotificationHeader
        unreadCount={unreadCount}
        connected={connected}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification List */}
        <div className="lg:col-span-2">
          {/* Filter */}
          <NotificationFilter
            filter={filter}
            onFilterChange={setFilter}
          />

          {/* List */}
          <NotificationList
            notifications={notifications}
            loading={loading}
            selectedNotification={selectedNotification}
            onNotificationSelect={handleNotificationSelect}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            filter={filter}
          />

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <NotificationDetail
            selectedNotification={selectedNotification}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
