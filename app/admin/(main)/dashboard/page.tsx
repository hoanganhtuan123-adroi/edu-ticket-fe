import AdminHeader from '@/app/components/admin/layout/AdminHeader';
import DashboardStats from '@/app/components/admin/dashboard/DashboardStats';
import RecentActivity from '@/app/components/admin/dashboard/RecentActivity';
import AccessStatistics from '@/app/components/admin/dashboard/AccessStatistics';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="p-6">
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
          
          <div className="lg:col-span-2">
            <AccessStatistics />
          </div>
        </div>
      </div>
    </div>
  );
}
