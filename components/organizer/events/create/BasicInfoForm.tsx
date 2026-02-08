import React from 'react';
import { CategoryResponse } from '@/service/admin/category.service';
import { CreateEventDto } from '@/types/event.types';

interface BasicInfoFormProps {
  formData: CreateEventDto;
  categories: CategoryResponse[];
  loadingCategories: boolean;
  onInputChange: (field: keyof CreateEventDto, value: any) => void;
}

export default function BasicInfoForm({ 
  formData, 
  categories, 
  loadingCategories, 
  onInputChange 
}: BasicInfoFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cơ bản</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục sự kiện *
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => onInputChange('categoryId', Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loadingCategories}
          >
            <option value={0}>-- Chọn danh mục --</option>
            {categories.map((category: CategoryResponse) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề sự kiện *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tiêu đề sự kiện"
            maxLength={255}
            required
          />
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả sự kiện
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Mô tả chi tiết về sự kiện của bạn..."
        />
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa điểm tổ chức *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => onInputChange('location', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập địa điểm tổ chức sự kiện"
          maxLength={255}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian bắt đầu *
          </label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => onInputChange('startTime', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian kết thúc *
          </label>
          <input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => onInputChange('endTime', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={formData.startTime}
            required
          />
        </div>
      </div>
    </div>
  );
}
