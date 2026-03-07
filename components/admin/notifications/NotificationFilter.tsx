"use client";

import { Filter } from "lucide-react";

type FilterType = "all" | "unread" | "read";

interface NotificationFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function NotificationFilter({ filter, onFilterChange }: NotificationFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <div className="flex gap-2">
          {(["all", "unread", "read"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
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
  );
}
