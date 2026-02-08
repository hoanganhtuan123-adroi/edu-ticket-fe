"use client";

import { useState } from 'react';

interface TabItem {
  id: string;
  label: string;
}

const tabs: TabItem[] = [
  { id: 'week', label: 'Tuần' },
  { id: 'month', label: 'Tháng' },
  { id: 'year', label: 'Năm' },
];

const weekData = [
  { day: 'T2', visits: 120 },
  { day: 'T3', visits: 150 },
  { day: 'T4', visits: 180 },
  { day: 'T5', visits: 140 },
  { day: 'T6', visits: 200 },
  { day: 'T7', visits: 160 },
  { day: 'CN', visits: 80 },
];

export default function AccessStatistics() {
  const [activeTab, setActiveTab] = useState('week');

  const maxVisits = Math.max(...weekData.map(d => d.visits));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Thống kê truy cập</h2>
        
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between space-x-2">
          {weekData.map((data) => (
            <div key={data.day} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-blue-600 rounded-t-sm transition-all duration-300 hover:bg-blue-700"
                  style={{
                    height: `${(data.visits / maxVisits) * 100}%`,
                    minHeight: '4px',
                  }}
                />
                <span className="text-xs text-gray-600 mt-2">{data.day}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
          <span className="text-sm text-gray-600">Lượt truy cập</span>
        </div>
      </div>
    </div>
  );
}
