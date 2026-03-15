import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Camera, X, CheckCircle, RefreshCw } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { checkinService } from "@/service/organizer/checkin.service";
import toast from "react-hot-toast";
import CheckInSuccessModal from "./CheckInSuccessModal";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onScanSuccess: (result: any) => void;
  onCheckInSuccess?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  isOpen,
  onClose,
  eventId,
  onScanSuccess,
  onCheckInSuccess,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [cameraError, setCameraError] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [checkInData, setCheckInData] = useState<any>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessing = useRef(false); // Quan trọng: Chống spam request

  useEffect(() => {
    if (isOpen) {
      // Delay một chút để đảm bảo DOM element #qr-reader đã sẵn sàng
      const timer = setTimeout(() => startScanner(), 300);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    }
  }, [isOpen]);

  const extractTicketCode = (qrData: string): string | null => {
    if (!qrData) return null;
    try {
      const cleanData = qrData.trim();

      // 1. Tìm theo format "ticketCode: TKT..." (i: không phân biệt hoa thường)
      const labelMatch = cleanData.match(/ticketCode:\s*([a-zA-Z0-9]+)/i);
      if (labelMatch) return labelMatch[1];

      // 2. Nếu là mã thuần túy (Chỉ gồm chữ và số, bắt đầu bằng TKT)
      if (/^[a-zA-Z0-9]+$/.test(cleanData)) return cleanData;

      return null;
    } catch (error) {
      console.error("Error parsing QR data:", error);
      return null;
    }
  };

  const startScanner = async () => {
    setIsScanning(true);
    setCameraError("");
    setScanResult("");

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 15, // Tăng fps để quét mượt hơn
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (decodedText && !isProcessing.current) {
            handleScanResult(decodedText);
          }
        },
        () => {}, // Bỏ qua log lỗi "NotFound" để tránh lag console
      );
    } catch (error: any) {
      console.error("Failed to start scanner:", error);
      setCameraError(
        "Không thể truy cập Camera. Hãy đảm bảo bạn đã cấp quyền.",
      );
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Stop scanner error:", err);
      }
    }
    isProcessing.current = false;
  };

  const handleScanResult = async (qrData: string) => {
    const ticketCode = extractTicketCode(qrData);
    if (!ticketCode) {
      return;
    }

    try {
      isProcessing.current = true; // Khóa ngay lập tức
      setScanResult(ticketCode);

      // Giả lập hoặc lấy Device ID cố định từ LocalStorage
      const deviceId = "WEB_BROWSER_" + navigator.userAgent.slice(0, 10);

      const result = await checkinService.checkInClient(ticketCode, deviceId);

      if (result.success) {
        toast.success("Check-in thành công!");
        onScanSuccess(result.data);
        setCheckInData(result.data);
        setShowSuccessModal(true);
        onCheckInSuccess?.(); // Trigger real-time UI update
        // Ngừng quét nhưng không đóng modal ngay
        await stopScanner();
      } else {
        console.log`check mess :: ${result.message}`;
        const errorMessage = Array.isArray(result.message)
          ? result.message.map((m: any) => m.message).join(", ")
          : result.message || "Vé không hợp lệ";
        toast.error(errorMessage);

        setTimeout(() => {
          isProcessing.current = false;
          setScanResult("");
        }, 2500);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Lỗi hệ thống khi check-in";
      const displayMessage = Array.isArray(errorMessage)
        ? errorMessage.map((m: any) => m.message || m).join(", ")
        : errorMessage;
      toast.error(displayMessage);
      setTimeout(() => {
        isProcessing.current = false;
        setScanResult("");
      }, 2500);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Quét mã QR Check-in</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {cameraError ? (
            <div className="text-center py-6">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-semibold mb-2">{cameraError}</p>
              <button
                onClick={startScanner}
                className="mt-2 text-blue-600 font-medium hover:underline"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden shadow-inner">
                <div id="qr-reader" className="w-full h-full" />

                {/* Overlay khung quét */}
                <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                  <div className="w-full h-full border-2 border-blue-500 relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1"></div>
                  </div>
                </div>

                {isProcessing.current && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white text-sm font-medium">
                        Đang xử lý...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {scanResult && (
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-3">
                  <CheckCircle className="text-blue-600 w-5 h-5" />
                  <span className="text-sm font-mono text-blue-800 break-all line-clamp-1">
                    Mã: {scanResult}
                  </span>
                </div>
              )}

              <div className="text-center space-y-1">
                <p className="text-gray-600 font-medium">
                  Đưa mã QR vào trung tâm ống kính
                </p>
                <p className="text-xs text-gray-400 italic">
                  Sự kiện: {eventId}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 flex justify-end border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-600 font-medium hover:text-gray-800"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
      
      {/* Check-in Success Modal */}
      <CheckInSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setCheckInData(null);
          onClose(); // Đóng QR Scanner modal sau khi đóng success modal
        }}
        data={checkInData}
      />
    </div>,
    document.body,
  );
};

export default QRScanner;
