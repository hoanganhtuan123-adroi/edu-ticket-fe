"use client";

interface ApprovedEvent {
  id: string;
  name: string;
  creator: string;
  eventDate: string;
  status: 'approved';
  approvalDate: string;
}

const mockApprovedEvents: ApprovedEvent[] = [
  {
    id: '1',
    name: 'Triển lãm Nghệ thuật Đương đại',
    creator: 'Lê Văn C',
    eventDate: '15/10/2023',
    status: 'approved',
    approvalDate: '10/10/2023'
  },
  {
    id: '2',
    name: 'Hội thảo Khởi nghiệp',
    creator: 'Phạm Thị D',
    eventDate: '20/10/2023',
    status: 'approved',
    approvalDate: '12/10/2023'
  }
];

export default function RecentApprovedEvents() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Sự kiện đã duyệt gần đây</h2>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Tên sự kiện</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Người tạo</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Ngày diễn ra</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Ngày duyệt</th>
            </tr>
          </thead>
          <tbody>
            {mockApprovedEvents.map((event) => (
              <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{event.name}</td>
                <td className="py-3 px-4 text-gray-600">{event.creator}</td>
                <td className="py-3 px-4 text-gray-600">{event.eventDate}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Đã duyệt
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{event.approvalDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
