"use client";

import { Calendar, Ticket, Users, TrendingUp } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any;
}

const statsData: StatCard[] = [
  {
    title: 'Sự kiện đã tạo',
    value: '24',
    change: '+15%',
    changeType: 'increase',
    icon: Calendar,
  },
  {
    title: 'Vé đã bán',
    value: '1,847',
    change: '+23%',
    changeType: 'increase',
    icon: Ticket,
  },
  {
    title: 'Người tham gia',
    value: '1,623',
    change: '+18%',
    changeType: 'increase',
    icon: Users,
  },
  {
    title: 'Doanh thu',
    value: '₫124.5M',
    change: '+32%',
    changeType: 'increase',
    icon: TrendingUp,
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <stat.icon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
