import OrganizerHeader from '@/components/organizer/layout/OrganizerHeader';
import DashboardStats from '@/components/organizer/dashboard/DashboardStats';
import RecentEvents from '@/components/organizer/dashboard/RecentEvents';
import EventStatistics from '@/components/organizer/dashboard/EventStatistics';

export default function OrganizerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <OrganizerHeader />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Tổng quan quản lý sự kiện của bạn</p>
        </div>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
          <div className="xl:col-span-1">
            <RecentEvents />
          </div>
          
          <div className="xl:col-span-2">
            <EventStatistics />
          </div>
        </div>
      </div>
    </div>
  );
}
