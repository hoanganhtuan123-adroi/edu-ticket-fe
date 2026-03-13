import React from "react";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

interface SummaryStatisticsProps {
  statistics: {
    totalSoldTickets: number;
    checkedIn: number;
    notCheckedIn: number;
    percentage: number;
  };
}

const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({ statistics }) => {
  const statCards = [
    {
      title: "Tổng đăng ký",
      value: statistics.totalSoldTickets,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Đã check-in",
      value: statistics.checkedIn,
      icon: UserCheck,
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Còn lại",
      value: statistics.notCheckedIn,
      icon: UserX,
      color: "bg-orange-50 text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      title: "Tỷ lệ check-in",
      value: `${statistics.percentage}%`,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm border ${stat.borderColor} p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryStatistics;
