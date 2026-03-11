import React from 'react';
import { Ticket, Calendar, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { TicketType, EventDetail } from './types';

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
  isProcessing
}: PurchaseModalProps) {
  if (!isOpen || !ticket || !event) return null;

  const [provider, setProvider] = React.useState<"VNPAY" | "MOMO">("VNPAY");

  const formatPrice = (price: string) => {
    const priceValue = parseFloat(price);
    if (priceValue === 0) {
      return 'Miễn phí';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(priceValue);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop with animation */}
      <div 
        className="fixed inset-0 w-screen h-screen bg-black transition-all duration-300 ease-in-out z-40"
        style={{ 
          backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        }}
        onClick={handleClose}
      />
      
      {/* Modal with animation */}
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-out border-t-4 border-purple-600"
          style={{
            transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
            opacity: isOpen ? 1 : 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-xl transform transition-transform duration-200 hover:scale-105">
                <Ticket className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Xác nhận đăng ký vé
                </h3>
                <p className="text-sm text-gray-600">
                  {event.title}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90 disabled:opacity-50 disabled:hover:rotate-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Ticket Info Card */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 mb-6 border border-purple-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{ticket.name}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      ticket.type === 'VIP' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      Còn lại: {ticket.quantityLimit - ticket.soldQuantity} vé
                    </span>
                  </div>
                  {ticket.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{ticket.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">
                    {formatPrice(ticket.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Thông tin sự kiện</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Thời gian</p>
                      <p className="font-medium text-gray-900">{formatDate(event.startTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Địa điểm</p>
                      <p className="font-medium text-gray-900">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Ticket className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Vé đã đăng ký không thể hoàn tiền</li>
                      <li>Vui lòng kiểm tra lại thông tin trước khi xác nhận</li>
                      <li>Mã vé sẽ được gửi qua email sau khi đăng ký thành công</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setProvider("VNPAY")}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    provider === "VNPAY"
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">VNPAY</div>
                  <div className="text-xs text-gray-500">Thẻ ATM, Visa, Mastercard</div>
                </button>
                <button
                  onClick={() => setProvider("MOMO")}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    provider === "MOMO"
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">MoMo</div>
                  <div className="text-xs text-gray-500">Ví điện tử MoMo</div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Hủy
            </button>
            <button
              onClick={() => onConfirm(provider)}
              disabled={isProcessing}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 disabled:hover:scale-100 font-medium"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  Xác nhận đăng ký
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
