"use client";

import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const monthlyData = [
  { month: 'T1', events: 4, revenue: 15.2 },
  { month: 'T2', events: 6, revenue: 22.8 },
  { month: 'T3', events: 8, revenue: 31.5 },
  { month: 'T4', events: 5, revenue: 18.9 },
  { month: 'T5', events: 9, revenue: 42.3 },
  { month: 'T6', events: 7, revenue: 28.7 },
];

const eventTypeData = [
  { type: 'Hội thảo', count: 12, color: 'bg-green-500' },
  { type: 'Workshop', count: 8, color: 'bg-teal-500' },
  { type: 'Ngày hội', count: 6, color: 'bg-cyan-500' },
  { type: 'Seminar', count: 4, color: 'bg-blue-500' },
];

export default function EventStatistics() {
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const maxEvents = Math.max(...monthlyData.map(d => d.events));

  return (
    <div className="space-y-6">
      {/* Revenue Chart - Simple Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tháng</h2>
        <div className="space-y-3">
          {monthlyData.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-8 text-sm font-medium text-gray-600">{item.month}</div>
              <div className="flex-1 relative">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">₫{item.revenue}M</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Types and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Phân loại sự kiện</h2>
          <div className="space-y-3">
            {eventTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700">{item.type}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng sự kiện</h2>
          <div className="space-y-3">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 text-sm font-medium text-gray-600">{item.month}</div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-teal-500 h-4 rounded-full"
                      style={{ width: `${(item.events / maxEvents) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-8 text-sm font-medium text-gray-900 text-right">{item.events}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
              <p className="text-2xl font-bold text-green-600">89%</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">Tỷ lệ lấp đầy</p>
            <p className="text-xs text-gray-500 mt-2">Trung bình 6 tháng</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-1" />
              <p className="text-2xl font-bold text-blue-600">4.8</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">Đánh giá trung bình</p>
            <p className="text-xs text-gray-500 mt-2">Từ 1,245 người tham gia</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 mr-1" />
              <p className="text-2xl font-bold text-purple-600">92%</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">Tỷ lệ tham gia</p>
            <p className="text-xs text-gray-500 mt-2">So với vé đã bán</p>
          </div>
        </div>
      </div>
    </div>
  );
}
