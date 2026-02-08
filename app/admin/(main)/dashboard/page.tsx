import AdminHeader from '@/components/admin/layout/AdminHeader';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import AccessStatistics from '@/components/admin/dashboard/AccessStatistics';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Tổng quan hệ thống quản lý vé sự kiện</p>
        </div>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
          <div className="xl:col-span-1">
            <RecentActivity />
          </div>
          
          <div className="xl:col-span-2">
            <AccessStatistics />
          </div>
        </div>
      </div>
    </div>
  );
}
