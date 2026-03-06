"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Send, 
  Paperclip, 
  X, 
  AlertCircle, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { CreateSupportRequestFormData, createSupportRequestSchema, validateFile } from '@/lib/validations/support.validation';
import { Event } from '@/types/event.types';

interface SupportFormProps {
  onSubmit: (data: CreateSupportRequestFormData) => void;
  isLoading: boolean;
  events: Event[];
  attachedFiles: File[];
  fileErrors: string[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  apiError?: string | null;
}

export default function SupportForm({
  onSubmit,
  isLoading,
  events,
  attachedFiles,
  fileErrors,
  onFileChange,
  onRemoveFile,
  apiError
}: SupportFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateSupportRequestFormData>({
    resolver: zodResolver(createSupportRequestSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      eventId: '',
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div className="text-red-700 text-sm">{apiError}</div>
          </div>
        )}
        
        {fileErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            {fileErrors.map((fileError, index) => (
              <div key={index} className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div className="text-red-700 text-sm">{fileError}</div>
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            maxLength={255}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none ${
              errors.title 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300'
            }`}
            placeholder="Ví dụ: Lỗi khi tạo sự kiện mới"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Tối đa 255 ký tự
          </p>
        </div>

        {/* Event Selection */}
        <div>
          <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
            Sự kiện liên quan (không bắt buộc)
          </label>
          <select
            id="eventId"
            {...register('eventId')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none ${
              errors.eventId 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300'
            }`}
          >
            <option value="">-- Chọn sự kiện --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Chọn sự kiện nếu vấn đề của bạn liên quan đến sự kiện cụ thể
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={6}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none resize-vertical ${
              errors.description 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300'
            }`}
            placeholder="Vui lòng mô tả chi tiết về vấn đề bạn đang gặp phải, các bước đã thử, và kết quả mong muốn..."
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* File Attachments */}
        <FileUploadSection
          attachedFiles={attachedFiles}
          onFileChange={onFileChange}
          onRemoveFile={onRemoveFile}
        />

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading || !isValid || attachedFiles.length === 0 && fileErrors.length > 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gửi yêu cầu</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

interface FileUploadSectionProps {
  attachedFiles: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

function FileUploadSection({ attachedFiles, onFileChange, onRemoveFile }: FileUploadSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tệp đính kèm (không bắt buộc)
      </label>
      <div className="space-y-3">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Paperclip className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo và thả
              </p>
              <p className="text-xs text-gray-500">
                PDF, Word, JPG, PNG, GIF, WebP (Tối đa 10MB, 5 file)
              </p>
            </div>
            <input
              id="file-input"
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
              onChange={onFileChange}
            />
          </label>
        </div>

        {attachedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Tệp đã chọn:</p>
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
