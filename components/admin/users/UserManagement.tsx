"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateUserForm from './CreateUserForm';
import UserList from './UserList';
import { UserResponse } from '@/service/admin/user.service';

export default function UserManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user);
    // Note: You would need to create an EditUserForm component for editing
    // For now, we'll just show a placeholder
    alert(`Chức năng sửa người dùng ${user.fullName} sẽ được triển khai sau`);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tạo người dùng</span>
        </button>
      </div>

      {/* Create User Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex items-center justify-center p-4 h-screen w-screen"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full max-w-4xl max-h-[95vh] overflow-y-auto flex items-center justify-center"
            >
              <CreateUserForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Form Modal (Placeholder) */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex items-center justify-center p-4 h-screen w-screen"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Chỉnh sửa người dùng: {editingUser.fullName}
                  </h2>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  Chức năng chỉnh sửa người dùng sẽ được triển khai sau.
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User List */}
      <UserList
        onEditUser={handleEditUser}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
