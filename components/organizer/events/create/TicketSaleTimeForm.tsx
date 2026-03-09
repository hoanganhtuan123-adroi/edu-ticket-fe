"use client";

interface TicketSaleTimeFormProps {
  startSaleTime: string;
  endSaleTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

export default function TicketSaleTimeForm({
  startSaleTime,
  endSaleTime,
  onStartTimeChange,
  onEndTimeChange,
}: TicketSaleTimeFormProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thời gian bán vé</h3>
        <p className="text-sm text-gray-600 mb-4">
          Thiết lập thời gian bắt đầu và kết thúc bán vé cho tất cả các loại vé của sự kiện này.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian bắt đầu bán *
            </label>
            <input
              type="datetime-local"
              value={startSaleTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian kết thúc bán *
            </label>
            <input
              type="datetime-local"
              value={endSaleTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
