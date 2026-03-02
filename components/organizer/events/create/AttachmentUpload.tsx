"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

interface AttachmentFile {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
}

interface AttachmentUploadProps {
  attachments: AttachmentFile[];
  onAttachmentsChange: (attachments: AttachmentFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

export default function AttachmentUpload({
  attachments,
  onAttachmentsChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
}: AttachmentUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    'image/webp',
  ];

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `Kích thước file không được vượt quá ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return 'Loại file không được hỗ trợ. Chỉ chấp nhận PDF, DOC, DOCX, và file ảnh';
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newAttachments: AttachmentFile[] = [];
    const errors: string[] = [];

    // Check if adding files would exceed max files
    if (attachments.length + files.length > maxFiles) {
      toast.error(`Chỉ được tải lên tối đa ${maxFiles} file`);
      return;
    }

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        // Check for duplicate files
        const isDuplicate = attachments.some(
          (attachment) => attachment.name === file.name && attachment.size === file.size
        );
        
        if (!isDuplicate) {
          newAttachments.push({
            file,
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
          });
        }
      }
    });

    // Show errors if any
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    // Update attachments
    if (newAttachments.length > 0) {
      onAttachmentsChange([...attachments, ...newAttachments]);
      toast.success(`Đã thêm ${newAttachments.length} file`);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFiles(files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    const updatedAttachments = attachments.filter((attachment) => attachment.id !== id);
    onAttachmentsChange(updatedAttachments);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string): string => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Tài liệu đính kèm
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Tải lên các tài liệu liên quan đến sự kiện (PDF, DOC, DOCX, ảnh). Tối đa {maxFiles} file, mỗi file không quá {Math.round(maxSize / (1024 * 1024))}MB.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={attachments.length >= maxFiles}
        />
        
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span> hoặc kéo và thả file vào đây
          </div>
          <div className="text-xs text-gray-500">
            PDF, DOC, DOCX, JPG, PNG, GIF, WEBP (tối đa {Math.round(maxSize / (1024 * 1024))}MB mỗi file)
          </div>
        </div>
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            File đã chọn ({attachments.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(attachment.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Xóa file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
