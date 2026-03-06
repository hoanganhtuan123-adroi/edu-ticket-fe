import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from './StatusBadge';
import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface SupportDetailHeaderProps {
  request: SupportRequestDetailResponseDto;
}

export function SupportDetailHeader({ request }: SupportDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại danh sách
      </button>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Chi tiết yêu cầu hỗ trợ
        </h1>
        <StatusBadge status={request.status} />
      </div>
    </div>
  );
}
