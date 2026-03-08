import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';

export interface Speaker {
  name: string;
  title?: string;
  bio?: string;
  avatar?: string;
}

export interface AdditionalInfo {
  speakers: Speaker[];
  targetAudience?: string;
}

interface AdditionalInfoFormProps {
  data: AdditionalInfo;
  onChange: (data: AdditionalInfo) => void;
  onSpeakerAvatarChange?: (speakerIndex: number, file: File | null) => void;
}

const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({ data, onChange, onSpeakerAvatarChange }) => {
  const [avatarPreviews, setAvatarPreviews] = useState<{ [key: number]: string }>({});

  const addSpeaker = () => {
    const newSpeakers = [...data.speakers, { name: '', title: '', bio: '' }];
    onChange({ ...data, speakers: newSpeakers });
  };

  const updateSpeaker = (index: number, field: keyof Speaker, value: string) => {
    const newSpeakers = [...data.speakers];
    newSpeakers[index] = { ...newSpeakers[index], [field]: value };
    onChange({ ...data, speakers: newSpeakers });
  };

  const handleAvatarFileChange = (index: number, file: File | null) => {
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)$/)) {
        alert('Chỉ chấp nhận file ảnh (jpg, png, gif, webp)');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreviews(prev => ({ ...prev, [index]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      // Remove preview
      setAvatarPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
    }

    // Notify parent component about file change
    if (onSpeakerAvatarChange) {
      onSpeakerAvatarChange(index, file);
    }
  };

  const removeSpeaker = (index: number) => {
    const newSpeakers = data.speakers.filter((_, i) => i !== index);
    onChange({ ...data, speakers: newSpeakers });
  };

  return (
    <div className="space-y-6">
      {/* Diễn giả */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin diễn giả</h3>
          <button
            type="button"
            onClick={addSpeaker}
            className="flex items-center px-3 py-2 text-sm bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm diễn giả
          </button>
        </div>

        <div className="space-y-4">
          {data.speakers.map((speaker, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-900">Diễn giả {index + 1}</h4>
                {data.speakers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên diễn giả *
                  </label>
                  <input
                    type="text"
                    value={speaker.name}
                    onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                    placeholder="Nhập tên diễn giả"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chức danh
                  </label>
                  <input
                    type="text"
                    value={speaker.title || ''}
                    onChange={(e) => updateSpeaker(index, 'title', e.target.value)}
                    placeholder="VD: CEO, Giảng viên, Chuyên gia..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiểu sử
                  </label>
                  <textarea
                    value={speaker.bio || ''}
                    onChange={(e) => updateSpeaker(index, 'bio', e.target.value)}
                    placeholder="Thông tin về diễn giả, kinh nghiệm, thành tựu..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    {/* Avatar Preview */}
                    <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-300 overflow-hidden flex-shrink-0">
                      {(avatarPreviews[index] || data.speakers[index].avatar) ? (
                        <img
                          src={avatarPreviews[index] || data.speakers[index].avatar}
                          alt={`Avatar ${speaker.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* File Upload */}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAvatarFileChange(index, e.target.files?.[0] || null)}
                        className="hidden"
                        id={`avatar-upload-${index}`}
                      />
                      <label
                        htmlFor={`avatar-upload-${index}`}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Chọn ảnh
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF, WebP (Tối đa 5MB)
                      </p>
                    </div>

                    {/* Remove Button */}
                    {(avatarPreviews[index] || data.speakers[index].avatar) && (
                      <button
                        type="button"
                        onClick={() => handleAvatarFileChange(index, null)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {data.speakers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Chưa có diễn giả nào. Nhấn "Thêm diễn giả" để bắt đầu.</p>
            </div>
          )}
        </div>
      </div>

      {/* Đối tượng tham gia */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đối tượng tham gia</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả đối tượng tham gia
          </label>
          <textarea
            value={data.targetAudience || ''}
            onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
            placeholder="VD: Sinh viên, developers, marketers, business owners..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoForm;
