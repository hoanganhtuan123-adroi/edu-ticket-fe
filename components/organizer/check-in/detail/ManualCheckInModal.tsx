import React, { useState } from "react";
import { X, UserCheck, Clock, Calendar } from "lucide-react";

interface Attendee {
  id: number;
  name: string;
  mssv: string;
  email: string;
  ticketType: string;
  registrationDate: string;
}

interface ManualCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendee: Attendee | null;
  eventId: string;
  onConfirm: (note?: string) => Promise<void>;
  isLoading?: boolean;
}

const ManualCheckInModal: React.FC<ManualCheckInModalProps> = ({
  isOpen,
  onClose,
  attendee,
  eventId,
  onConfirm,
  isLoading = false
}) => {
  const [note, setNote] = useState("");

  if (!isOpen || !attendee) return null;

  const handleConfirm = async () => {
    await onConfirm(note);
    setNote(""); // Reset note after confirmation
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setNote("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Check-in Thủ công
              </h3>
              <p className="text-sm text-gray-500">
                Xác nhận check-in cho người tham dự
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Attendee Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Họ và tên</span>
              <span className="text-sm font-medium text-gray-900">
                {attendee.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">MSSV</span>
              <span className="text-sm font-medium text-gray-900">
                {attendee.mssv}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-900">
                {attendee.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Loại vé</span>
              <span className="text-sm font-medium text-gray-900">
                {attendee.ticketType}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Ngày đăng ký</span>
              <span className="text-sm font-medium text-gray-900">
                {attendee.registrationDate}
              </span>
            </div>
          </div>

          {/* Note Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thêm ghi chú cho check-in này..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800">
                  Hành động này không thể hoàn tác. Vé sẽ được đánh dấu đã sử dụng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>Xác nhận Check-in</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualCheckInModal;
