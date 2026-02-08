import AdminHeader from '@/components/admin/layout/AdminHeader';
import EventModerationList from '@/components/admin/events/EventModerationList';
import RecentApprovedEvents from '@/components/admin/events/RecentApprovedEvents';

export default function EventModeration() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Kiểm duyệt sự kiện</h1>
          <p className="text-gray-600">Tổng quan về hệ thống và quản lý</p>
        </div>

        {/* Event Moderation Section */}
        <EventModerationList />
        
        {/* Recent Approved Events */}
        <RecentApprovedEvents />
      </div>
    </div>
  );
}
