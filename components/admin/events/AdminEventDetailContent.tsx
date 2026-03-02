import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Tag, 
  Ticket, 
  User,
  CheckCircle,
  XCircle,
  Download,
  FileText
} from 'lucide-react';
import { AdminEventDetail } from '@/service/admin/event.service';

interface AdminEventDetailContentProps {
  event: AdminEventDetail;
  onApprove: () => void;
  onReject: () => void;
}

export default function AdminEventDetailContent({ event, onApprove, onReject }: AdminEventDetailContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(parseFloat(price));
  };

  const formatFileSize = (bytes: string | number): string => {
    const size = typeof bytes === 'string' ? parseInt(bytes) : bytes;
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    const r = Math.round(size / Math.pow(k, i) * 100) / 100;
    return `${r} ${sizes[i]}`;
  };

  const getFileTypeLabel = (fileType: string): string => {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF',
      'application/msword': 'Word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
      'image/jpeg': 'JPEG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'image/webp': 'WebP',
    };
    return typeMap[fileType] || fileType;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Nháp',
      },
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Chờ xử lý',
      },
      PENDING_APPROVAL: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Chờ phê duyệt',
      },
      APPROVED: {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Đã phê duyệt',
      },
      CANCELLED: {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Đã hủy',
      },
      COMPLETED: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Đã hoàn thành',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Banner */}
      <div className="relative h-64 lg:h-80">
        {event.bannerUrl ? (
          <img 
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600">Không có banner</p>
            </div>
          </div>
        )}
        
        {/* Overlay with title and status */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            {getStatusBadge(event.status)}
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
              {event.category?.name}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">{event.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Buttons */}
            {event.status === 'PENDING' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onApprove}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Phê duyệt
                  </button>
                  <button
                    onClick={onReject}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả sự kiện</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            )}

            {/* Event Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin chi tiết</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bắt đầu</p>
                      <p className="font-medium text-gray-900">{formatDate(event.startTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kết thúc</p>
                      <p className="font-medium text-gray-900">{formatDate(event.endTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Địa điểm</p>
                      <p className="font-medium text-gray-900">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Danh mục</p>
                      <p className="font-medium text-gray-900">{event.category?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Types */}
            {event.ticketTypes && event.ticketTypes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Loại vé ({event.ticketTypes.length})</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Loại vé</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Giá</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Số lượng</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Đã bán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.ticketTypes.map((ticket, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{ticket.name}</p>
                              <p className="text-sm text-gray-500">{ticket.description}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                ticket.type === 'VIP' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {ticket.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-gray-900">{formatPrice(ticket.price)}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-900">{ticket.quantityLimit}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-900">{ticket.soldQuantity}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Info */}
            {event.organizer && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Người tổ chức
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium text-gray-900">{event.organizer?.fullName || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{event.organizer?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Event Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Trạng thái</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Trạng thái hiện tại</p>
                  <div className="mt-1">{getStatusBadge(event.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium text-gray-900">{formatDate(event.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Event Attachments */}
            {event.attachments && event.attachments.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Tài liệu đính kèm
                </h3>
                <div className="space-y-3">
                  {event.attachments.map((attachment: any) => (
                    <div key={attachment.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {attachment.fileName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>Kích thước: {formatFileSize(attachment.fileSize)}</span>
                            <span>Loại: {getFileTypeLabel(attachment.fileType)}</span>
                          </div>
                        </div>
                        <a
                          href={`http://localhost:8080${attachment.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          Tải xuống
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval History */}
            {event.approvalHistory && event.approvalHistory.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Lịch sử phê duyệt
                </h3>
                <div className="space-y-3">
                  {event.approvalHistory.map((history, index) => (
                    <div key={history.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {history.action === 'APPROVED' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : history.action === 'REJECTED' ? (
                            <XCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-600" />
                          )}
                          <span className={`font-medium text-sm ${
                            history.action === 'APPROVED' 
                              ? 'text-green-800' 
                              : history.action === 'REJECTED'
                              ? 'text-red-800'
                              : 'text-blue-800'
                          }`}>
                            {history.action === 'APPROVED' ? 'Đã phê duyệt' : 
                             history.action === 'REJECTED' ? 'Đã từ chối' : 'Đã nộp'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(history.createdAt)}
                        </span>
                      </div>
                      
                      {history.admin && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Người xử lý</p>
                          <p className="text-sm font-medium text-gray-900">
                            {history.admin.fullName || 'Hệ thống'}
                          </p>
                          <p className="text-xs text-gray-600">{history.admin.email}</p>
                        </div>
                      )}
                      
                      {history.reason && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Lý do</p>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                            {history.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
