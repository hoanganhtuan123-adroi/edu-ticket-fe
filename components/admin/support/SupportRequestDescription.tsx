"use client";

import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface SupportRequestDescriptionProps {
  request: SupportRequestDetailResponseDto;
}

export default function SupportRequestDescription({ request }: SupportRequestDescriptionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Mô tả yêu cầu</h2>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
      </div>
    </div>
  );
}
