import React from "react";

interface PaymentDetailsProps {
  totalAmount: string;
  provider: string;
  bankCode: string;
  providerTxnRef: string;
  paidAt: string;
  createdAt: string;
  paymentMethod: string;
  formatPrice: (price: string) => string;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  totalAmount,
  provider,
  bankCode,
  providerTxnRef,
  paidAt,
  createdAt,
  paymentMethod,
  formatPrice,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Chi tiết thanh toán
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tổng tiền:</span>
          <div className="text-right">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(totalAmount)}
            </span>
            <p className="text-xs text-gray-500 mt-1">Đã thanh toán</p>
          </div>
        </div>

        {paymentMethod !== "Unknown" && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức:</span>
              <span className="text-gray-900">{paymentMethod}</span>
            </div>

            {providerTxnRef && (
              <div className="flex justify-between">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-mono text-gray-900">{providerTxnRef}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian thanh toán:</span>
              <span className="text-gray-900">
                {paidAt
                  ? new Date(paidAt).toLocaleString("vi-VN")
                  : "Chưa thanh toán"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
