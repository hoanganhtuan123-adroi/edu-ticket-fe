import React from "react";
import { Search, Plus, MapPin, Calendar, Bell } from "lucide-react";
import Link from "next/link";

const DashboardHeader = () => {
  return (
    <>
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-8 px-4 sm:py-12">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Khám Phá Sự Kiện Thú Vị
            </h1>
            <p className="text-base sm:text-lg opacity-90">
              Hàng trăm sự kiện đang chờ đón bạn. Tham gia ngay!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                className="pl-10 bg-amber-50 outline-0 pr-4 py-3 rounded-lg text-gray-900 w-full sm:w-64 lg:w-80 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ET</span>
                </div>
                <span className="font-bold text-lg lg:text-xl">Edu Ticket</span>
              </div>
              <div className="hidden lg:flex space-x-6">
                <Link
                  href="#"
                  className="text-purple-700 font-medium hover:text-purple-800 transition-colors"
                >
                  Sự kiện
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Lịch sử tham gia
                </Link>
              </div>
            </div>

            {/* Desktop: User Info */}
            <div className="hidden lg:flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="text-right">
                <p className="font-semibold text-gray-900">Nguyễn Văn A</p>
                <p className="text-xs text-purple-600 font-medium">
                  Thành viên VIP
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">NA</span>
              </div>
            </div>

            {/* Mobile: User Info + Bell */}
            <div className="lg:hidden flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">NA</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">
                    Nguyễn Văn A
                  </p>
                  <p className="text-xs text-purple-600 font-medium">VIP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="lg:hidden border-t border-gray-200 py-3">
            <div className="flex justify-around">
              <Link
                href="#"
                className="text-purple-700 font-medium hover:text-purple-800 transition-colors text-sm"
              >
                Sự kiện
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Lịch sử tham gia
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default DashboardHeader;
