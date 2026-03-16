import React from "react";
import {
  Ticket,
  Calendar,
  MapPin,
  X,
  CreditCard,
  Wallet,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { TicketType, EventDetail } from "./types";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketType;
  event: EventDetail;
  onConfirm: (provider: "VNPAY" | "MOMO") => Promise<void>;
  isProcessing: boolean;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  ticket,
  event,
  onConfirm,
  isProcessing,
}: PurchaseModalProps) {
  if (!isOpen || !ticket || !event) return null;

  const [provider, setProvider] = React.useState<"VNPAY" | "MOMO">("VNPAY");

  const formatPrice = (price: string) => {
    const priceValue = parseFloat(price);
    if (priceValue === 0) {
      return "Miễn phí";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(priceValue);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  const getTicketTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      REGULAR: "Thường",
      VIP: "VIP", 
      FREE: "Miễn phí",
    };
    return labels[type] || type;
  };

  const isPaidTicket = parseFloat(ticket.price) > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Xác nhận đăng ký
                </h3>
              </div>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Event Title */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Sự kiện</p>
              <h4 className="text-lg font-semibold text-gray-900 leading-tight">
                {event.title}
              </h4>
            </div>

            {/* Ticket Info Card */}
            <div className="bg-purple-50 rounded-xl p-5 mb-6 border border-purple-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold text-gray-900">
                      {ticket.name}
                    </h5>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        ticket.type === "VIP"
                          ? "bg-purple-200 text-purple-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {getTicketTypeLabel(ticket.type)}
                    </span>
                  </div>
                  {ticket.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {ticket.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Còn lại:{" "}
                      <span className="font-medium text-gray-900">
                        {ticket.quantityLimit - ticket.soldQuantity} vé
                      </span>
                    </span>
                    <span className="text-2xl font-bold text-purple-600">
                      {formatPrice(ticket.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thời gian</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(event.startTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Địa điểm</p>
                  <p className="font-medium text-gray-900">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                  <ul className="space-y-1 list-disc list-inside text-amber-700">
                    <li>Vé đã đăng ký không thể hoàn/hủy</li>
                    <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
                    <li>
                      Mã vé sẽ được gửi qua email sau khi đăng ký thành công
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            {isPaidTicket && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Chọn phương thức thanh toán
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setProvider("VNPAY")}
                    disabled={isProcessing}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      provider === "VNPAY"
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <CreditCard
                        className={`w-6 h-6 mb-2 ${
                          provider === "VNPAY"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium text-sm ${
                          provider === "VNPAY"
                            ? "text-purple-700"
                            : "text-gray-700"
                        }`}
                      >
                        VNPAY
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Thẻ ATM, Visa
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setProvider("MOMO")}
                    disabled={isProcessing}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      provider === "MOMO"
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Wallet
                        className={`w-6 h-6 mb-2 ${
                          provider === "MOMO"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium text-sm ${
                          provider === "MOMO"
                            ? "text-purple-700"
                            : "text-gray-700"
                        }`}
                      >
                        MoMo
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Ví điện tử
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={() => onConfirm(provider)}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5" />
                    <span>Xác nhận</span>
                  </>
                )}
              </button>
            </div>
            {isPaidTicket && (
              <p className="text-xs text-center text-gray-500 mt-3">
                Bằng việc xác nhận, bạn đồng ý với điều khoản sử dụng của chúng
                tôi
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
