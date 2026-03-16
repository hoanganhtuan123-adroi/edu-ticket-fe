import React, { useState } from "react";
import { Eye, Check, X } from "lucide-react";

interface Registration {
  id: string;
  fullName: string;
  studentCode: string;
  bookingStatus: string;
  bookingTime: string;
  email?: string;
  bookingCode?: string;
  totalAmount?: string;
  ticketType?: string;
  ticketCode?: string;
  ticketStatus?: string;
}

interface RegistrationTableProps {
  registrations: Registration[];
  onViewDetails: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBulkApprove?: (bookingCodes: string[]) => void;
}

export default function RegistrationTable({
  registrations,
  onViewDetails,
  onApprove,
  onReject,
  onBulkApprove,
}: RegistrationTableProps) {
  const [selectedBookingCodes, setSelectedBookingCodes] = useState<string[]>(
    [],
  );

  const handleCheckboxChange = (bookingCode: string, checked: boolean) => {
    if (checked) {
      setSelectedBookingCodes((prev) => [...prev, bookingCode]);
    } else {
      setSelectedBookingCodes((prev) =>
        prev.filter((code) => code !== bookingCode),
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Lấy tất cả mã booking có tồn tại (không lọc theo PENDING)
      const allCodes = registrations
        .map((reg) => reg.bookingCode || reg.id)
        .filter(Boolean) as string[];
      setSelectedBookingCodes(allCodes);
    } else {
      setSelectedBookingCodes([]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedBookingCodes.length > 0 && onBulkApprove) {
      onBulkApprove(selectedBookingCodes);
      setSelectedBookingCodes([]);
    }
  };

  // Kiểm tra xem tất cả các item hiện có đã được chọn hay chưa
  const isAllSelected =
    registrations.length > 0 &&
    registrations.every((reg) =>
      selectedBookingCodes.includes(reg.bookingCode || reg.id),
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "PAID":
        return "Đã duyệt";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Bulk Controls - Luôn hiển thị thanh điều khiển này */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              Đã chọn{" "}
              <span className="text-blue-600">
                {selectedBookingCodes.length}
              </span>{" "}
              đăng ký
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              Chọn tất cả
            </label>

            <button
              onClick={handleBulkApprove}
              disabled={selectedBookingCodes.length === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                selectedBookingCodes.length > 0
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4" />
              Duyệt mục đã chọn
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-3 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sinh viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MSSV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian đăng ký
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.map((registration) => {
              const rowKey = registration.bookingCode || registration.id;
              return (
                <tr
                  key={registration.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="w-12 px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedBookingCodes.includes(rowKey)}
                      onChange={(e) =>
                        handleCheckboxChange(rowKey, e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {registration.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {registration.studentCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(registration.bookingTime).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.bookingStatus)}`}
                    >
                      {getStatusText(registration.bookingStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onViewDetails(registration.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                        Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {registrations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không có dữ liệu đăng ký</p>
        </div>
      )}
    </div>
  );
}
