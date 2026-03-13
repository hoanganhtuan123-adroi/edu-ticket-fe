// import React, { useState, useRef, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { Camera, X, CheckCircle } from "lucide-react";
// import { Html5Qrcode } from "html5-qrcode";
// import { checkinService } from "@/service/organizer/checkin.service";
// import toast from "react-hot-toast";

// interface QRScannerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   eventId: string;
//   onScanSuccess: (result: any) => void;
// }

// const QRScanner: React.FC<QRScannerProps> = ({
//   isOpen,
//   onClose,
//   eventId,
//   onScanSuccess,
// }) => {
//   const [isScanning, setIsScanning] = useState(false);
//   const [scanResult, setScanResult] = useState<string>("");
//   const [cameraError, setCameraError] = useState<string>("");
//   const scannerRef = useRef<any>(null);

//   useEffect(() => {
//     if (isOpen) {
//       startScanner();
//     }

//     return () => {
//       stopScanner();
//     };
//   }, [isOpen]);

//   const startScanner = () => {
//     setIsScanning(true);
//     setCameraError("");

//     try {
//       // Create scanner instance
//       const scanner = new Html5Qrcode("qr-reader");
//       scannerRef.current = scanner;

//       // Start scanning
//       scanner
//         .start(
//           { facingMode: "environment" },
//           {
//             fps: 10,
//             qrbox: { width: 250, height: 250 },
//           },
//           (decodedText: string, decodedResult: any) => {
//             if (decodedText) {
//               setScanResult(decodedText);
//               handleScanResult(decodedText);
//             }
//           },
//           (errorMessage: string) => {
//             // Handle scan errors silently - these are normal when no QR code is detected
//             // Only log actual errors, not "not found" messages
//             if (
//               !errorMessage.includes("NotFoundException") &&
//               !errorMessage.includes("No MultiFormat Readers")
//             ) {
//               console.warn("QR scan error:", errorMessage);
//             }
//           },
//         )
//         .then(() => {
//           console.log("QR Scanner started successfully");
//         })
//         .catch((error: any) => {
//           console.error("Failed to start scanner:", error);
//           setCameraError("Không thể khởi động camera. Vui lòng thử lại.");
//           setIsScanning(false);
//         });
//     } catch (error: any) {
//       console.error("Scanner initialization error:", error);
//       setCameraError("Không thể khởi động scanner. Vui lòng thử lại.");
//       setIsScanning(false);
//     }
//   };

//   const stopScanner = () => {
//     try {
//       if (scannerRef.current) {
//         scannerRef.current
//           .stop()
//           .then(() => {
//             console.log("QR Scanner stopped successfully");
//           })
//           .catch((error: any) => {
//             console.error("Error stopping scanner:", error);
//           })
//           .finally(() => {
//             scannerRef.current = null;
//           });
//       }
//       setIsScanning(false);
//       setScanResult("");
//       setCameraError("");
//     } catch (error: any) {
//       console.error("Error stopping scanner:", error);
//     }
//   };

//   const handleScanResult = async (qrData: string) => {
//     try {
//       // Extract ticket code from QR data
//       const ticketCode = extractTicketCode(qrData);
//       console.log(`check :::: ${ticketCode}`);

//       if (ticketCode) {
//         // Call API to check in
//         const deviceId = generateDeviceId();
//         const result = await checkinService.checkInClient(ticketCode, deviceId);

//         if (result.success) {
//           toast.success("Check-in thành công!");
//           onScanSuccess(result.data);
//           stopScanner();
//           onClose();
//         } else {
//           toast.error(result.message || "Check-in thất bại");
//         }
//       } else {
//         toast.error("Mã QR không hợp lệ");
//       }
//     } catch (error: any) {
//       console.error("Check-in error:", error);
//       toast.error(error.message || "Có lỗi xảy ra khi check-in");
//     }
//   };

//   const extractTicketCode = (qrData: string): string | null => {
//     try {
//       if (qrData.includes("ticketCode:")) {
//         const match = qrData.match(/ticketCode:\s*([A-Z0-9]+)/);
//         return match ? match[1] : null;
//       }

//       if (/^[A-Z0-9]+$/.test(qrData)) {
//         return qrData;
//       }

//       return null;
//     } catch (error) {
//       console.error("Error parsing QR data:", error);
//       return null;
//     }
//   };

//   const generateDeviceId = (): string => {
//     // Generate a unique device ID
//     return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   };

//   if (!isOpen) return null;

//   return createPortal(
//     <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <div className="flex items-center">
//             <Camera className="w-6 h-6 text-blue-600 mr-3" />
//             <h3 className="text-lg font-semibold text-gray-900">
//               Quét mã QR Check-in
//             </h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Scanner Content */}
//         <div className="p-6">
//           {cameraError ? (
//             <div className="text-center py-8">
//               <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <X className="w-8 h-8 text-red-500" />
//               </div>
//               <p className="text-red-600 font-medium mb-2">Lỗi Camera</p>
//               <p className="text-gray-600 text-sm">{cameraError}</p>
//               <button
//                 onClick={startScanner}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Thử lại
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* QR Scanner Container */}
//               <div
//                 className="relative bg-black rounded-lg overflow-hidden"
//                 style={{ aspectRatio: "1/1" }}
//               >
//                 <div
//                   id="qr-reader"
//                   className="w-full h-full"
//                   style={{ minHeight: "300px" }}
//                 />

//                 {/* Scanning Overlay */}
//                 {isScanning && (
//                   <div className="absolute inset-0 pointer-events-none">
//                     <div className="absolute inset-4 border-2 border-blue-500 rounded-lg animate-pulse"></div>
//                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                       <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                         Đang quét...
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Scan Result */}
//               {scanResult && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                   <div className="flex items-center">
//                     <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
//                     <div>
//                       <p className="text-green-800 font-medium">
//                         Đã quét thành công!
//                       </p>
//                       <p className="text-green-700 text-sm mt-1">
//                         Mã vé: {scanResult}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Instructions */}
//               <div className="text-center text-gray-600 text-sm">
//                 <p>Đưa mã QR vào vùng quét để check-in</p>
//                 <p className="mt-1">Mã sự kiện: #{eventId.slice(0, 8)}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end p-6 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//           >
//             Đóng
//           </button>
//         </div>
//       </div>
//     </div>,
//     document.body,
//   );
// };

// export default QRScanner;

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Camera, X, CheckCircle, RefreshCw } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { checkinService } from "@/service/organizer/checkin.service";
import toast from "react-hot-toast";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onScanSuccess: (result: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  isOpen,
  onClose,
  eventId,
  onScanSuccess,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [cameraError, setCameraError] = useState<string>("");
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
        // Ngừng quét và đóng modal sau khi thành công
        await stopScanner();
        onClose();
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
    </div>,
    document.body,
  );
};

export default QRScanner;
