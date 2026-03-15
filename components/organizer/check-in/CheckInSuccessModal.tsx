import React from "react";
import { CheckCircle, Calendar, MapPin, User, Clock, X } from "lucide-react";

interface CheckInSuccessData {
  studentName: string;
  studentCode: string;
  ticketType: string;
  checkInTime: string;
  eventTitle: string;
}

interface CheckInSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CheckInSuccessData | null;
}

const CheckInSuccessModal: React.FC<CheckInSuccessModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Check-in Thành Công!</h3>
                <p className="text-green-100 text-xs sm:text-sm mt-1">
                  Người tham dự đã được check-in thành công
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Success Animation */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 animate-pulse" />
            </div>
          </div>

          {/* Attendee Info */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Họ và tên</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{data.studentName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">MSSV</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{data.studentCode}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-blue-600">VÉ</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Loại vé</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{data.ticketType}</p>
              </div>
            </div>
          </div>

          {/* Event Info */}
          <div className="bg-blue-50 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Sự kiện</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{data.eventTitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Thời gian check-in</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{formatDateTime(data.checkInTime)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={onClose}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg text-sm sm:text-base"
          >
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInSuccessModal;
