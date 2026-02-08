"use client";

import { UserPlus, CalendarCheck, UserX } from 'lucide-react';

interface Activity {
  id: string;
  type: 'user_registered' | 'event_approved' | 'user_blocked';
  title: string;
  description: string;
  time: string;
  icon: any;
  iconColor: string;
  iconBgColor: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'user_registered',
    title: 'Người dùng mới đăng ký',
    description: 'Nguyễn Văn A',
    time: '10 phút trước',
    icon: UserPlus,
    iconColor: 'text-green-600',
    iconBgColor: 'bg-green-50',
  },
  {
    id: '2',
    type: 'event_approved',
    title: 'Sự kiện đã được duyệt',
    description: 'Hội thảo công nghệ 2023',
    time: '2 giờ trước',
    icon: CalendarCheck,
    iconColor: 'text-blue-600',
    iconBgColor: 'bg-blue-50',
  },
  {
    id: '3',
    type: 'user_blocked',
    title: 'Người dùng bị khóa',
    description: 'user123',
    time: '5 giờ trước',
    icon: UserX,
    iconColor: 'text-red-600',
    iconBgColor: 'bg-red-50',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${activity.iconBgColor}`}>
                <Icon className={`w-5 h-5 ${activity.iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
