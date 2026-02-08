import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface BannerUploadProps {
  bannerFile: File | null;
  bannerPreview: string | null;
  onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveBanner: () => void;
}

export default function BannerUpload({ 
  bannerFile, 
  bannerPreview, 
  onBannerChange, 
  onRemoveBanner 
}: BannerUploadProps) {
  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Banner sự kiện
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {bannerPreview ? (
          <div className="relative">
            <img
              src={bannerPreview}
              alt="Banner preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={onRemoveBanner}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label htmlFor="banner-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Tải lên banner sự kiện
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PNG, JPG, GIF, WebP tối đa 10MB
                </span>
                <input
                  id="banner-upload"
                  name="banner"
                  type="file"
                  className="sr-only"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={onBannerChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                hoặc kéo và thả file vào đây
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
