"use client";

import { Download } from 'lucide-react';
import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface SupportRequestAttachmentsProps {
  request: SupportRequestDetailResponseDto;
  onDownloadFile: (fileUrl: string, fileName: string) => void;
  formatFileSize: (size: string) => string;
  getFileIcon: (mimeType: string) => string;
  formatDate: (dateString: string) => string;
}

export default function SupportRequestAttachments({
  request,
  onDownloadFile,
  formatFileSize,
  getFileIcon,
  formatDate,
}: SupportRequestAttachmentsProps) {
  if (!request.attachments || request.attachments.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tệp đính kèm</h3>
      <div className="space-y-3">
        {request.attachments.map((attachment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(attachment.mimeType)}</span>
              <div>
                <p className="font-medium text-gray-900">{attachment.fileName}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(attachment.fileSize)} • {formatDate(attachment.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDownloadFile(attachment.fileUrl, attachment.fileName)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Tải xuống</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
