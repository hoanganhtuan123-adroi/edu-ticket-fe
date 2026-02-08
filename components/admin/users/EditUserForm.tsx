"use client";

import { useState, useEffect } from 'react';
import { userService, SystemRole, UserDetailResponse } from '@/service/admin/user.service';
import { motion } from 'framer-motion';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Update user schema (similar to create but without password requirement)
const updateUserSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  phoneNumber: z.string().min(1, 'Số điện thoại không được để trống').regex(/^[0-9]{10,11}$/, 'Số điện thoại không đúng định dạng'),
  role: z.nativeEnum(SystemRole),
  faculty: z.string().optional(),
  studentCode: z.string().optional(),
}).refine((data) => {
  if (data.role === SystemRole.ORGANIZER) {
    return data.faculty !== undefined && data.faculty.trim().length > 0;
  }
  return true;
}, {
  message: 'Khoa không được để trống đối với Ban tổ chức',
  path: ['faculty'],
}).refine((data) => {
  if (data.role === SystemRole.USER) {
    return data.studentCode !== undefined && data.studentCode.trim().length > 0;
  }
  return true;
}, {
  message: 'Mã sinh viên không được để trống đối với Người dùng',
  path: ['studentCode'],
});

interface EditUserFormProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditUserForm({ userId, onSuccess, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    role: SystemRole.USER,
    faculty: '',
    studentCode: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await userService.getUserDetail(userId);
        if (response.success && response.data) {
          const userData = response.data;
          setFormData({
            email: userData.email,
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            role: userData.systemRole,
            faculty: userData.faculty || '',
            studentCode: userData.studentCode || '',
          });
        }
      } catch (error: any) {
        setErrors({ fetch: error.message || 'Lấy thông tin người dùng thất bại' });
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    try {
      updateUserSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await userService.updateUser(userId, formData);
      setIsLoading(true);
      if(response.success) {
        toast.success("Cập nhật thông tin thành công!")
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setIsLoading(false);
      setErrors({ submit: error.message || 'Cập nhật người dùng thất bại' });
    }
  };

  if (isFetching) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto w-full"
      >
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải thông tin người dùng...</span>
        </div>
      </motion.div>
    );
  }

  if (errors.fetch) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto w-full"
      >
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600">{errors.fetch}</p>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Chỉnh sửa thông tin người dùng</h2>
          <p className="text-gray-500 text-sm mt-1">Cập nhật thông tin tài khoản người dùng</p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập họ tên đầy đủ"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={SystemRole.USER}>Người dùng</option>
              <option value={SystemRole.ORGANIZER}>Ban tổ chức</option>
              <option value={SystemRole.ADMIN}>Quản trị viên</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Faculty - Only for ORGANIZER */}
          {formData.role === SystemRole.ORGANIZER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khoa *
              </label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.faculty ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập khoa"
              />
              {errors.faculty && (
                <p className="text-red-500 text-xs mt-1">{errors.faculty}</p>
              )}
            </div>
          )}

          {/* Student Code - Only for USER */}
          {formData.role === SystemRole.USER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã sinh viên *
              </label>
              <input
                type="text"
                name="studentCode"
                value={formData.studentCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.studentCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập mã sinh viên"
              />
              {errors.studentCode && (
                <p className="text-red-500 text-xs mt-1">{errors.studentCode}</p>
              )}
            </div>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật người dùng'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
