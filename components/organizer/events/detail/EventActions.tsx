import React from "react";
import { ArrowLeft, Edit, Eye, Copy, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface EventActionsProps {
  eventData: any;
}

export default function EventActions({ eventData }: EventActionsProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/organizer/events/${eventData.slug}/edit`);
  };

  const handlePreview = () => {
    window.open(`/events/${eventData.slug}`, "_blank");
  };

  const handleDuplicate = () => {
    // Handle duplicate event
    toast.success("Tính năng đang phát triển");
  };

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại</span>
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow"
            >
              <Eye className="w-4 h-4" />
              <span className="font-medium">Xem trước</span>
            </button>

            <button
              onClick={handleDuplicate}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow"
            >
              <Copy className="w-4 h-4" />
              <span className="font-medium">Nhân bản</span>
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Edit className="w-4 h-4" />
              <span className="font-medium">Chỉnh sửa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
