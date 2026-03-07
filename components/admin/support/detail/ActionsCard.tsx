import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import toast from "react-hot-toast";
import { SupportRequestStatus } from "@/service/admin/support.service";

interface ActionsCardProps {
  onBack: () => void;
  ticketCode: string;
  currentStatus: string;
  onCloseRequest: (ticketCode: string) => Promise<any>;
  handleUpdateStatus: (
    ticketCode: string,
    status: SupportRequestStatus,
  ) => Promise<void>;
  isLoading: boolean;
}

export function ActionsCard({
  onBack,
  ticketCode,
  currentStatus,
  onCloseRequest,
  handleUpdateStatus,
  isLoading,
}: ActionsCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showStatusConfirmDialog, setShowStatusConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] =
    useState<SupportRequestStatus | null>(null);

  const handleCloseRequest = async () => {
    if (!ticketCode) return;

    try {
      await onCloseRequest(ticketCode);
    } catch (error: any) {
      // Error is already handled by the parent component with toast
      console.error("Close request failed:", error);
    }
  };

  const handleUpdateStatusClick = async () => {
    if (!ticketCode || !pendingStatus) return;

    try {
      await handleUpdateStatus(ticketCode, pendingStatus);
    } catch (error: any) {
      // Error is already handled by the parent service with toast
      console.error("Update status failed:", error);
    } finally {
      setPendingStatus(null);
      setShowStatusConfirmDialog(false);
    }
  };

  const handleStatusClick = (status: SupportRequestStatus) => {
    setPendingStatus(status);
    setShowStatusConfirmDialog(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(true);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h2>

        <div className="space-y-3">
          {/* Bắt đầu xử lý - Chỉ hiển thị khi status là OPEN */}
          {currentStatus === SupportRequestStatus.OPEN && (
            <button
              onClick={() =>
                handleStatusClick(SupportRequestStatus.IN_PROGRESS)
              }
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang xử lý..." : "Bắt đầu xử lý"}
            </button>
          )}

          {/* Đánh dấu đã giải quyết - Chỉ hiển thị khi status là IN_PROGRESS */}
          {currentStatus === SupportRequestStatus.IN_PROGRESS && (
            <button
              onClick={() => handleStatusClick(SupportRequestStatus.RESOLVED)}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang xử lý..." : "Đánh dấu đã giải quyết"}
            </button>
          )}

          {/* Đóng yêu cầu - Chỉ hiển thị khi status là RESOLVED */}
          {currentStatus === SupportRequestStatus.RESOLVED && (
            <button
              onClick={handleConfirmClose}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang xử lý..." : "Đóng yêu cầu hỗ trợ"}
            </button>
          )}

          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Gửi phản hồi
          </button>

          <button
            onClick={onBack}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Xác nhận đóng yêu cầu hỗ trợ"
        message="Bạn có chắc chắn muốn đóng yêu cầu hỗ trợ này? Hành động này không thể hoàn tác."
        confirmText="Đóng yêu cầu"
        cancelText="Hủy"
        type="danger"
        onConfirm={() => {
          setShowConfirmDialog(false);
          handleCloseRequest();
        }}
        onCancel={() => setShowConfirmDialog(false)}
      />

      <ConfirmDialog
        isOpen={showStatusConfirmDialog}
        title="Xác nhận cập nhật trạng thái"
        message={`Bạn có chắc chắn muốn cập nhật trạng thái yêu cầu hỗ trợ này?`}
        confirmText="Cập nhật"
        cancelText="Hủy"
        type="info"
        onConfirm={() => {
          handleUpdateStatusClick();
        }}
        onCancel={() => {
          setShowStatusConfirmDialog(false);
          setPendingStatus(null);
        }}
      />
    </div>
  );
}
