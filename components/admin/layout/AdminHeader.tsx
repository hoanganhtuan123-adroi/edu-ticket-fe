"use client";

import { LogOut, User } from 'lucide-react';
import { useAdminAuth } from '@/hooks/auth/useAdminAuth';
import { NotificationBell } from '@/components/admin/notification/NotificationBell';

export default function AdminHeader() {
  const { user, logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.email || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 text-red-600 hover:text-red-800 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
