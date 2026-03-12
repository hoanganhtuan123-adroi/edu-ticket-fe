import React from "react";
import {
  AlertCircle,
  Maximize2,
  Tag,
  CreditCard,
  Clock,
  Ticket,
} from "lucide-react";

interface TicketInfoProps {
  qrCodeHash: string;
  ticketTypeName: string;
  ticketPrice: string;
  ticketStatus: string;
  ticketType: string;
  ticketCode: string;
  ticketDescription?: string;
  bookingCode: string;
  formatPrice: (price: string) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const TicketInfo: React.FC<TicketInfoProps> = ({
  qrCodeHash,
  ticketTypeName,
  ticketPrice,
  ticketStatus,
  ticketType,
  ticketCode,
  ticketDescription,
  bookingCode,
  formatPrice,
  getStatusColor,
  getStatusText,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header với gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Thông tin vé
        </h3>
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* QR Code Section */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              {qrCodeHash ? (
                <div className="relative group">
                  <img
                    src={qrCodeHash}
                    alt="QR Code"
                    className="w-full aspect-square object-contain rounded-lg bg-white p-2 shadow-sm group-hover:shadow-md transition-all"
                  />
                  <button
                    onClick={() => window.open(qrCodeHash, "_blank")}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                  >
                    <div className="bg-white/90 rounded-full p-2">
                      <Maximize2 className="w-5 h-5 text-purple-600" />
                    </div>
                  </button>
                </div>
              ) : (
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
              <Maximize2 className="w-3 h-3" />
              Nhấn vào QR để phóng to
            </p>
          </div>

          {/* Ticket Info Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mã vé */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <CreditCard className="w-4 h-4" />
                <p className="text-sm font-medium">Mã vé</p>
              </div>
              <p className="font-mono text-xl font-bold text-gray-900 tracking-wider break-all">
                {ticketCode || bookingCode}
              </p>
            </div>

            {/* Loại vé */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Tag className="w-4 h-4" />
                <p className="text-sm font-medium">Loại vé</p>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">
                  {ticketTypeName}
                </p>
                {ticketType && (
                  <span className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {ticketType}
                  </span>
                )}
                {ticketDescription && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {ticketDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Giá vé */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <p className="text-sm font-medium">Giá vé</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-purple-600">
                  {formatPrice(ticketPrice)}
                </span>
                <span className="text-sm text-gray-500 ml-2">VNĐ / vé</span>
              </div>
            </div>

            {/* Trạng thái vé */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock className="w-4 h-4" />
                <p className="text-sm font-medium">Trạng thái vé</p>
              </div>
              <span
                className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(
                  ticketStatus,
                )}`}
              >
                {getStatusText(ticketStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer với booking code */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Mã đặt chỗ:{" "}
            <span className="font-mono font-medium text-gray-700">
              {bookingCode}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketInfo;
