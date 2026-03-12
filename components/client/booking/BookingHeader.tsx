import React from "react";
import { CheckCircle } from "lucide-react";

interface BookingHeaderProps {
  bookingCode: string;
  ticketStatus: string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({
  bookingCode,
  ticketStatus,
  getStatusColor,
  getStatusText,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Mã đặt vé</p>
          <p className="text-lg font-semibold text-gray-900">
            {bookingCode}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
              ticketStatus
            )}`}
          >
            {getStatusText(ticketStatus)}
          </span>
        </div>
      </div>

      {ticketStatus === "VALID" && (
        <div className="flex items-center text-green-600 mb-4">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Cảm ơn bạn đã đặt vé!</span>
        </div>
      )}

      {/* Payment continuation button removed - not in new API response */}
    </div>
  );
};

export default BookingHeader;
