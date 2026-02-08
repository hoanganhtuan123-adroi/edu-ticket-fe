"use client";

import { Users, CalendarCheck, Shield, TrendingUp } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any;
}

const statsData: StatCard[] = [
  {
    title: 'Tổng người dùng',
    value: '1,248',
    change: '+12%',
    changeType: 'increase',
    icon: Users,
  },
  {
    title: 'Sự kiện đã duyệt',
    value: '342',
    change: '+8%',
    changeType: 'increase',
    icon: CalendarCheck,
  },
  {
    title: 'Sự kiện chờ duyệt',
    value: '15',
    change: '-3%',
    changeType: 'decrease',
    icon: Shield,
  },
  {
    title: 'Tổng vai trò',
    value: '7',
    change: '+5%',
    changeType: 'increase',
    icon: TrendingUp,
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
}
