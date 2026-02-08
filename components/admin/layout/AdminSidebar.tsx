"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  CalendarCheck, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  X,
  Tags
} from 'lucide-react';

interface AdminSidebarProps {
  onClose?: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Quản lý người dùng', href: '/admin/users' },
  { icon: Shield, label: 'Quản lý vai trò', href: '/admin/roles' },
  { icon: Tags, label: 'Quản lý danh mục', href: '/admin/category' },
  { icon: CalendarCheck, label: 'Kiểm duyệt sự kiện', href: '/admin/events', badge: '5' },
  { icon: BarChart3, label: 'Báo cáo thống kê', href: '/admin/reports' },
];

const bottomMenuItems = [
  { icon: Settings, label: 'Cài đặt', href: '/admin/settings' },
  { icon: LogOut, label: 'Đăng xuất', href: '/admin/logout' },
];

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col z-50">
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-4">
        <button
          onClick={() => {
            console.log('Close button clicked');
            if (onClose) onClose();
          }}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="EventTicket.edu" 
            className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
          />
          <div>
            <h1 className="text-lg lg:text-xl font-bold">EventTicket.edu</h1>
            <p className="text-xs lg:text-sm text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
        <ul className="space-y-1 lg:space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                    <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                    <span className="text-xs lg:text-sm truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 lg:p-4 border-t border-gray-800">
        <ul className="space-y-1 lg:space-y-2">
          {bottomMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  <span className="text-xs lg:text-sm truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
