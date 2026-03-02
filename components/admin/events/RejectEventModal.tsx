"use client";

import { useState } from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

interface RejectEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  eventTitle: string;
  isLoading?: boolean;
}

export default function RejectEventModal({
  isOpen,
  onClose,
  onReject,
  eventTitle,
  isLoading = false,
}: RejectEventModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do từ chối sự kiện');
      return;
    }
    
    if (reason.trim().length < 10) {
      setError('Lý do từ chối phải có ít nhất 10 ký tự');
      return;
    }
    
    setError('');
    onReject(reason.trim());
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with animation - Full screen coverage */}
      <div 
        className="fixed inset-0 w-screen h-screen bg-black transition-all duration-300 ease-in-out z-40"
        style={{ 
          backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        }}
        onClick={handleClose}
      />
      
      {/* Modal with animation - Centered on screen */}
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out border-t-4 border-red-600"
          style={{
            transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
            opacity: isOpen ? 1 : 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg transform transition-transform duration-200 hover:scale-105">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Từ chối sự kiện
                </h3>
                <p className="text-sm text-gray-600 truncate max-w-xs">
                  {eventTitle}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90 disabled:opacity-50 disabled:hover:rotate-0"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError('');
                }}
                placeholder="Vui lòng nhập lý do từ chối sự kiện này..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-200 focus:shadow-sm"
                rows={4}
                disabled={isLoading}
              />
              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 transform transition-all duration-200 hover:shadow-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 animate-pulse" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Lưu ý:</p>
                  <ul className="list-disc list-inside space-y-1 text-amber-700">
                    <li>Lý do từ chối sẽ được gửi cho người tổ chức sự kiện</li>
                    <li>Sự kiện sẽ bị thay đổi trạng thái thành "Đã hủy"</li>
                    <li>Người tổ chức có thể tạo lại sự kiện sau khi sửa đổi</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || !reason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Từ chối sự kiện
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
