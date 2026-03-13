"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CheckInDetailIndexPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vui lòng chọn sự kiện
          </h1>
          <p className="text-gray-600">
            Bạn cần chọn một sự kiện cụ thể để xem chi tiết check-in.
          </p>
        </div>
        
        <Link
          href="/organizer/check-in"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách sự kiện</span>
        </Link>
      </div>
    </div>
  );
};

export default CheckInDetailIndexPage;
