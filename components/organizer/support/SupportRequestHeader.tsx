"use client";

import { FileText, Calendar, User, Copy } from "lucide-react";
import { SupportRequestDetailResponseDto } from "@/types/support.types";

interface SupportRequestHeaderProps {
  request: SupportRequestDetailResponseDto;
  onCopyTicketCode: (ticketCode: string) => void;
  copied: boolean;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
  formatDate: (dateString: string) => string;
}

export default function SupportRequestHeader({
  request,
  onCopyTicketCode,
  copied,
  getStatusColor,
  getStatusIcon,
  getStatusText,
  formatDate,
}: SupportRequestHeaderProps) {
  return (
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {request.title}
            </h1>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full flex items-center space-x-2 ${getStatusColor(request.status)}`}
            >
              {getStatusIcon(request.status)}
              <span>{getStatusText(request.status)}</span>
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {request.ticketCode}
              </span>
              <button
                onClick={() => onCopyTicketCode(request.ticketCode)}
                className="p-1 hover:bg-gray-100 rounded transition-colors group relative"
                title="Sao chép mã yêu cầu"
              >
                <Copy className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                {copied && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Đã sao chép!
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(request.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Phản hồi cuối: {request.lastRepliedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
