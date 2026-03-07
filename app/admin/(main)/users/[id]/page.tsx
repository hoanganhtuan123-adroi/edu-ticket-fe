"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminUserDetail } from "@/hooks/admin/useAdminUsers";
import UserDetail from "@/components/admin/users/UserDetail";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { loading, error, user, fetchUserDetail } = useAdminUserDetail(userId);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  const handleBack = () => {
    router.push("/admin/users");
  };

  const handleUserUpdate = () => {
    // Refresh user data after lock/unlock
    fetchUserDetail();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Đã xảy ra lỗi
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy người dùng
          </h3>
          <p className="text-gray-600 mb-4">
            Người dùng không tồn tại hoặc đã bị xóa
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <UserDetail user={user} onBack={handleBack} onUserUpdate={handleUserUpdate} />
    </div>
  );
}
