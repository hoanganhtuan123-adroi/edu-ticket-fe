import AdminHeader from '@/components/admin/layout/AdminHeader';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Cài đặt</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Cài đặt hệ thống và cấu hình</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Nội dung cài đặt sẽ được triển khai sau.</p>
        </div>
      </div>
    </div>
  );
}
