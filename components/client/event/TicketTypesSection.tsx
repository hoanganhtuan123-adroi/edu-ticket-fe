import { Ticket, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface TicketType {
  id: string;
  name: string;
  type: string;
  price: string;
  description?: string;
  startSaleTime: string;
  endSaleTime: string;
  quantityLimit: number;
  soldQuantity: number;
  status: string;
}

interface TicketTypesSectionProps {
  ticketTypes: TicketType[];
  getTicketTypeLabel: (type: string) => string;
  getTicketStatusFromStatus: (status: string) => {
    text: string;
    color: string;
    disabled: boolean;
    message: string;
  };
  formatDate: (dateString: string) => string;
  formatPrice: (price: string) => string;
  onTicketSelect: (ticket: TicketType) => void;
}

const TicketTypesSection = ({
  ticketTypes,
  getTicketTypeLabel,
  getTicketStatusFromStatus,
  formatDate,
  formatPrice,
  onTicketSelect,
}: TicketTypesSectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Ticket className="w-5 h-5 text-purple-600" />
        Loại vé ({ticketTypes.length})
      </h3>
      <div className="space-y-4">
        {ticketTypes.map((ticket, index) => {
          const individualTicketStatus = getTicketStatusFromStatus(ticket.status);
          return (
            <div
              key={index}
              className="border border-purple-200 rounded-lg p-4 bg-purple-50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {ticket.name}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ticket.type === "VIP"
                          ? "bg-purple-100 text-purple-800"
                          : ticket.type === "FREE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getTicketTypeLabel(ticket.type)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        individualTicketStatus.color === "bg-green-500"
                          ? "bg-green-100 text-green-800"
                          : individualTicketStatus.color === "bg-blue-500"
                            ? "bg-blue-100 text-blue-800"
                            : individualTicketStatus.color === "bg-red-500"
                              ? "bg-red-100 text-red-800"
                              : individualTicketStatus.color === "bg-orange-500"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {individualTicketStatus.text}
                    </span>
                  </div>
                  {ticket.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {ticket.description}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Bán từ: {formatDate(ticket.startSaleTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Đến: {formatDate(ticket.endSaleTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Giới hạn:</span>
                      <span className="font-medium text-gray-900">
                        {ticket.quantityLimit} vé
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Đã bán:</span>
                      <span className="font-medium text-green-600">
                        {ticket.soldQuantity} vé
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    {formatPrice(ticket.price)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Còn lại: {ticket.quantityLimit - ticket.soldQuantity} vé
                  </p>
                  <button
                    className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
                      individualTicketStatus.disabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-purple-700 text-white hover:bg-purple-800"
                    }`}
                    disabled={individualTicketStatus.disabled}
                    onClick={() => {
                      // Handle ticket purchase/registration
                      if (!individualTicketStatus.disabled) {
                        // Check if user is logged in (simple check)
                        const userToken = document.cookie
                          .split(";")
                          .find((cookie) =>
                            cookie.trim().startsWith("USER="),
                          );
                        if (!userToken) {
                          toast.error("Vui lòng đăng nhập để đăng ký vé!");
                          // TODO: Redirect to login page
                          return;
                        }

                        // Check if tickets are available
                        const availableTickets =
                          ticket.quantityLimit - ticket.soldQuantity;
                        if (availableTickets <= 0) {
                          toast.error("Loại vé này đã hết!");
                          return;
                        }
                        onTicketSelect(ticket);
                      }
                    }}
                  >
                    {individualTicketStatus.disabled
                      ? "Không thể đăng ký"
                      : "Đăng ký ngay"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketTypesSection;
