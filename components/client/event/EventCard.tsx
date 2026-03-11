import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export interface EventCardProps {
  title: string;
  slug: string;
  description: string;
  bannerUrl: string;
  location: string;
  startTime: string;
  status: string; 
  eventStatus?: string; 
  price?: number | null; 
  maxPrice?: number | null; 
  isFree?: boolean;
  isLiked?: boolean;
  isSoldOut?: boolean; 
  category?: string; 
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  slug,
  description,
  bannerUrl,
  location,
  startTime,
  status,
  eventStatus,
  price,
  maxPrice,
  isFree,
  isLiked = false,
  isSoldOut = false,
  category,
  onClick,
}) => {
  const getDisplayStatus = (ticketSaleStatus: string, eventStatus?: string) => {
    // Map event status to display status
    if (eventStatus === 'APPROVED') {
      return 'Sắp diễn ra';
    }
    if (eventStatus === 'ONGOING') {
      return 'Đang diễn ra';
    }
    if (eventStatus === 'COMPLETED') {
      return 'Đã kết thúc';
    }
    // Otherwise, use ticket sale status
    return ticketSaleStatus;
  };

  const getTicketStatusColor = (displayStatus: string) => {
    switch (displayStatus) {
      case 'Sắp diễn ra':
        return 'bg-blue-500';
      case 'Đang diễn ra':
        return 'bg-green-500';
      case 'Đã kết thúc':
        return 'bg-gray-500';
      case 'Sắp mở bán':
        return 'bg-blue-500';
      case 'Đang mở bán':
        return 'bg-green-500';
      case 'Ngừng bán':
        return 'bg-orange-500';
      case 'Hết vé':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img 
          src={bannerUrl || "/api/placeholder/400/200"} 
          alt={title} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-3 left-3">
          <span className={`${getTicketStatusColor(getDisplayStatus(status, eventStatus))} text-white px-3 py-1 rounded-full text-sm font-medium`}>
            {getDisplayStatus(status, eventStatus)}
          </span>
        </div>
        {isSoldOut && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Hết vé
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        {category && (
          <div className="flex items-center text-purple-600 text-sm mb-2">
            <span className="font-medium">Danh mục: {category}</span>
          </div>
        )}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{location}</span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center text-gray-600 text-sm mb-1">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Bắt đầu: {formatDate(startTime)}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          {isFree && maxPrice ? (
            <span className="text-green-600 font-bold text-lg">Miễn phí - {maxPrice.toLocaleString()} ₫</span>
          ) : isFree ? (
            <span className="text-green-600 font-bold text-lg">Miễn phí</span>
          ) : price && maxPrice && price === maxPrice ? (
            <span className="text-orange-600 font-bold text-lg">{price.toLocaleString()} ₫</span>
          ) : price && maxPrice ? (
            <span className="text-orange-600 font-bold text-lg">{price.toLocaleString()} - {maxPrice.toLocaleString()} ₫</span>
          ) : (
            <span className="text-orange-600 font-bold text-lg">Giá liên hệ</span>
          )}
        </div>
        <Link href={`/client/events/${slug}`}>
          <button 
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              isSoldOut 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-purple-700 text-white hover:bg-purple-800'
            }`}
            disabled={isSoldOut}
          >
            {isSoldOut ? 'Hết vé' : 'Xem chi tiết'}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
