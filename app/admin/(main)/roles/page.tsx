import AdminHeader from '@/components/admin/layout/AdminHeader';

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quản lý vai trò</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Quản lý vai trò và quyền truy cập</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Nội dung quản lý vai trò sẽ được triển khai sau.</p>
        </div>
      </div>
    </div>
  );
}
