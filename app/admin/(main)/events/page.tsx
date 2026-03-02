import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminEventsTable from '@/components/admin/events/AdminEventsTable';

export default function EventModeration() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="p-6">
        {/* Admin Events Table */}
        <AdminEventsTable />
      </div>
    </div>
  );
}
