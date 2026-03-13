import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 text-lg">Đang tải danh sách sự kiện...</p>
      </div>
    </div>
  );
};

export default LoadingState;
