import { useRouter } from 'next/navigation';

interface ActionsCardProps {
  onBack: () => void;
}

export function ActionsCard({ onBack }: ActionsCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h2>
        
        <div className="space-y-3">
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Bắt đầu xử lý
          </button>
          
          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Đánh dấu đã giải quyết
          </button>
          
          <button
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Gửi phản hồi
          </button>
          
          <button
            onClick={onBack}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
