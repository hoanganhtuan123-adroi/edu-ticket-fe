import React from "react";
import { Users, Calendar, TrendingUp } from "lucide-react";

interface RegistrationStatsProps {
  total: number;
  pending: number;
  approvalRate: number;
}

export default function RegistrationStats({ total, pending, approvalRate }: RegistrationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">TỔNG ĐĂNG KÝ</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">CHỜ DUYỆT</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{pending}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">TỶ LỆ DUYỆT</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{approvalRate}%</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
