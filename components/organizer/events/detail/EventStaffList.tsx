"use client";

import { Users } from "lucide-react";

interface EventStaffProps {
  eventStaff?: {
    id: string;
    fullName: string;
    studentCode?: string;
    email: string;
    staffRole: string;
  }[];
}

export default function EventStaffList({ eventStaff }: EventStaffProps) {
  if (!eventStaff || eventStaff.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Nhân viên được phân công
      </h3>

      <div className="divide-y divide-gray-100">
        {eventStaff.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            {/* Avatar */}
            <div className="shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">
              {staff.fullName?.charAt(0)?.toUpperCase() || "N"}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {staff.fullName}
              </p>
              <p className="text-xs text-gray-400 truncate">{staff.email}</p>
              {staff.studentCode && (
                <p className="text-xs text-gray-400">{staff.studentCode}</p>
              )}
            </div>

            {/* Role badge */}
            <span
              className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                staff.staffRole === "MANAGER"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {staff.staffRole === "MANAGER" ? "Quản lý" : "Check-in"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
