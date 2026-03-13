"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Activity, User } from "lucide-react";
import { useSocket } from "../../../../hooks/useSocket";
import { useCheckIn } from "../../../../hooks/organizer/useCheckIn";

interface CheckInLog {
  id: string | number;
  attendeeName: string;
  studentCode?: string;
  location?: string;
  time: string;
  staffName: string;
}

interface LiveCheckInLogProps {
  eventId: string;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (newOffset: number) => void;
}

interface NewCheckInData {
  eventId: string;
  logId: string;
  attendeeName: string;
  studentCode: string;
  checkInTime: string;
  staffName: string;
  deviceId: string;
  timestamp: string;
}

const LiveCheckInLog: React.FC<LiveCheckInLogProps> = ({
  eventId,
  pagination,
  onPageChange,
}) => {
  const [logs, setLogs] = useState<CheckInLog[]>([]);
  const [liveLogs, setLiveLogs] = useState<CheckInLog[]>([]);
  const [isLive, setIsLive] = useState(false);

  const { connected, joinEvent, leaveEvent, onNewCheckIn } = useSocket();
  const { getCheckInLogs, isLoading } = useCheckIn();

  // Function to fetch logs
  const fetchLogs = useCallback(async () => {
    try {
      const result = await getCheckInLogs(eventId, 20, 0);
      
      // Handle different response formats
      if (result?.success && result?.data) {
        const logsData = Array.isArray(result.data)
          ? result.data
          : result.data?.data || [];
        setLogs(logsData);
      } else if (result?.data) {
        const logsData = Array.isArray(result.data) ? result.data : [];
        setLogs(logsData);
      } else if (Array.isArray(result)) {
        // Direct array response
        setLogs(result);
      } else {
        setLogs([]);
      }
    } catch (error) {
      setLogs([]);
    }
  }, [eventId, getCheckInLogs]);

  // Join event room when component mounts
  useEffect(() => {
    if (eventId && connected) {
      joinEvent(eventId);
      setIsLive(true);

      return () => {
        leaveEvent(eventId);
        setIsLive(false);
      };
    }
  }, [eventId, connected, joinEvent, leaveEvent]);

  // Load initial logs
  useEffect(() => {
    if (eventId) {
      fetchLogs();
    }
  }, [eventId, fetchLogs]);

  // Listen for new check-in events
  useEffect(() => {
    if (!connected) return;

    const unsubscribe = onNewCheckIn((data: unknown) => {
      const checkInData = data as NewCheckInData;

      // Only process if it's for the current event
      if (checkInData.eventId === eventId) {
        const newLog: CheckInLog = {
          id: checkInData.logId,
          attendeeName: checkInData.attendeeName,
          studentCode: checkInData.studentCode,
          time: new Date(checkInData.checkInTime).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          staffName: checkInData.staffName,
        };

        setLiveLogs((prev) => [newLog, ...prev]);

        // Refetch the logs to update pagination
        fetchLogs();
      }
    });

    return unsubscribe;
  }, [connected, eventId, onNewCheckIn, fetchLogs]);

  // Merge live logs with existing logs
  const safeLogs = Array.isArray(logs) ? logs : [];
  const safeLiveLogs = Array.isArray(liveLogs) ? liveLogs : [];
  const allLogs = [...safeLiveLogs, ...safeLogs];
  const displayLogs = allLogs.slice(0, 20); // Show max 20 most recent logs

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Lịch sử check-in</h2>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {displayLogs.map((log, index) => (
          <div
            key={`${log.id}-${index}`}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
              index < liveLogs.length
                ? "bg-green-50 border border-green-200 animate-pulse"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < liveLogs.length ? "bg-green-100" : "bg-blue-100"
                }`}
              >
                <User
                  className={`w-4 h-4 ${index < liveLogs.length ? "text-green-600" : "text-blue-600"}`}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {log.attendeeName}{" "}
                  {log.studentCode ? `- ${log.studentCode}` : ""}
                </p>
                <span className="text-xs text-gray-500">{log.time}</span>
              </div>
              <div className="flex items-center space-x-3 mt-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    index < liveLogs.length
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {index < liveLogs.length ? "Vừa check-in" : "Người tham dự"}
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <User className="w-3 h-3 text-blue-500" />
                  <span>
                    <span className="text-gray-400">Người check-in:</span>{" "}
                    {log.staffName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {displayLogs.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có hoạt động check-in nào</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải logs...</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị {displayLogs.length} /{" "}
              {pagination.total + liveLogs.length} logs
              {liveLogs.length > 0 && (
                <span className="text-green-600 ml-1">
                  ({liveLogs.length} mới)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  onPageChange?.(pagination.offset - pagination.limit)
                }
                disabled={!pagination.hasPrev}
                className={`px-3 py-1 rounded text-sm ${
                  pagination.hasPrev
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Trước
              </button>
              <span className="text-sm text-gray-600">
                Trang {Math.floor(pagination.offset / pagination.limit) + 1}
              </span>
              <button
                onClick={() =>
                  onPageChange?.(pagination.offset + pagination.limit)
                }
                disabled={!pagination.hasNext}
                className={`px-3 py-1 rounded text-sm ${
                  pagination.hasNext
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCheckInLog;
