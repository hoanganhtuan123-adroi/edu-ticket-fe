"use client";

import { useState, useEffect } from 'react';
import { userService, FilterUserDto, UserResponse, SystemRole, PaginationResponse } from '@/service/admin/user.service';
import { motion } from 'framer-motion';

interface UserListProps {
  onEditUser?: (user: UserResponse) => void;
  refreshTrigger?: number;
}

export default function UserList({ onEditUser, refreshTrigger }: UserListProps) {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationResponse<UserResponse> | null>(null);
  const [filters, setFilters] = useState<FilterUserDto>({
    limit: 10,
    offset: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(filters);
      if (response.success && response.data) {
        setUsers(response.data.data);
        setPagination(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, refreshTrigger]);

  const handleFilterChange = (key: keyof FilterUserDto, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      offset: 0, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newOffset: number) => {
    setFilters(prev => ({
      ...prev,
      offset: newOffset,
    }));
  };

  const getRoleBadgeColor = (role: SystemRole) => {
    switch (role) {
      case SystemRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case SystemRole.ORGANIZER:
        return 'bg-blue-100 text-blue-800';
      case SystemRole.USER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: SystemRole) => {
    switch (role) {
      case SystemRole.ADMIN:
        return 'Quản trị viên';
      case SystemRole.ORGANIZER:
        return 'Ban tổ chức';
      case SystemRole.USER:
        return 'Người dùng';
      default:
        return role;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Xóa người dùng thất bại');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg"
    >
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={filters.email || ''}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã sinh viên</label>
            <input
              type="text"
              placeholder="Nhập mã sinh viên"
              value={filters.studentCode || ''}
              onChange={(e) => handleFilterChange('studentCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              value={filters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả</option>
              <option value={SystemRole.USER}>Người dùng</option>
              <option value={SystemRole.ORGANIZER}>Ban tổ chức</option>
              <option value={SystemRole.ADMIN}>Quản trị viên</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoa</label>
            <input
              type="text"
              placeholder="Nhập khoa"
              value={filters.faculty || ''}
              onChange={(e) => handleFilterChange('faculty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ limit: 10, offset: 0 })}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(filters.offset || 0) + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.systemRole)}`}>
                      {getRoleLabel(user.systemRole)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Hoạt động' : 'Khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {onEditUser && (
                        <button
                          onClick={() => onEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Sửa
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id.toString())}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} của {pagination.total} kết quả
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                disabled={pagination.offset === 0}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Trang {Math.floor(pagination.offset / pagination.limit) + 1} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(Math.min(pagination.offset + pagination.limit, (pagination.totalPages - 1) * pagination.limit))}
                disabled={pagination.offset >= (pagination.totalPages - 1) * pagination.limit}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
