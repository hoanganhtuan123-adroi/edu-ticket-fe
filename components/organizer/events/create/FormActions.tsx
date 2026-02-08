import React from 'react';

interface FormActionsProps {
  loading: boolean;
  onSaveDraft: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormActions({ loading, onSaveDraft, onSubmit }: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={loading}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang lưu...' : 'Lưu nháp'}
      </button>
      
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang tạo...' : 'Tạo sự kiện'}
      </button>
    </div>
  );
}
