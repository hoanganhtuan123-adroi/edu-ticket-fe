"use client";

import React from "react";
import { Users, ChevronLeft, ChevronRight, UserCircle2 } from "lucide-react";

interface Staff {
  id: string | number;
  name: string;
  role: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AssignedStaffProps {
  staff: Staff[];
  pagination?: Pagination;
  onPageChange: (newPage: number) => void;
  onStaffClick?: (staffId: string | number) => void;
}

const AssignedStaff: React.FC<AssignedStaffProps> = ({
  staff,
  pagination,
  onPageChange,
  onStaffClick,
}) => {
  const defaultPagination: Pagination = {
    page: 1,
    limit: 10,
    total: staff.length,
    totalPages: 1,
  };

  const p = pagination || defaultPagination;

  const getRoleStyle = (role: string) => {
    const r = role?.toLowerCase() || "";
    if (r.includes("manager") || r.includes("quản lý"))
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (r.includes("scanner") || r.includes("staff") || r.includes("nhân viên"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Nhân sự hỗ trợ
              </h2>
              <p className="text-xs text-gray-500">
                Danh sách nhân sự được phân công cho sự kiện
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
            {p.total} thành viên
          </span>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="p-5">
        {staff.length === 0 ? (
          <div className="text-center py-10 text-gray-400 font-medium">
            Chưa có nhân sự nào được phân công.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <div
                key={member.id}
                onClick={() => onStaffClick?.(member.id)}
                className="group flex items-center space-x-3 p-4 border border-gray-100 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer bg-white"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                  <UserCircle2 className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {member.name}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 mt-1 rounded border text-[10px] font-bold uppercase tracking-wider ${getRoleStyle(member.role)}`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer & Pagination */}
      {p.totalPages > 1 && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onPageChange(p.page - 1)}
              disabled={p.page <= 1}
              className="p-1.5 rounded-md border border-gray-300 bg-white disabled:opacity-40 disabled:bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <div className="text-sm font-semibold text-gray-700 bg-white px-3 py-1 border border-gray-200 rounded-md shadow-sm">
              Trang {p.page}{" "}
              <span className="text-gray-400 font-normal mx-1">/</span>{" "}
              {p.totalPages}
            </div>

            <button
              onClick={() => onPageChange(p.page + 1)}
              disabled={p.page >= p.totalPages}
              className="p-1.5 rounded-md border border-gray-300 bg-white disabled:opacity-40 disabled:bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedStaff;
