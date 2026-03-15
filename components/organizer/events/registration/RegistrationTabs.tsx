import React from "react";

interface RegistrationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export default function RegistrationTabs({ activeTab, onTabChange, stats }: RegistrationTabsProps) {
  const tabs = [
    { key: "all", label: "Tất cả", count: stats.total },
    { key: "pending", label: "Chờ duyệt", count: stats.pending },
    { key: "approved", label: "Đã duyệt", count: stats.approved },
    { key: "rejected", label: "Đã từ chối", count: stats.rejected }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              onTabChange(tab.key);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.key
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            {tab.label}
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
