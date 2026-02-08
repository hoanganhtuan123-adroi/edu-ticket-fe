import AdminHeader from '@/components/admin/layout/AdminHeader';
import UserManagement from '@/components/admin/users/UserManagement';

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <UserManagement />
      </div>
    </div>
  );
}
