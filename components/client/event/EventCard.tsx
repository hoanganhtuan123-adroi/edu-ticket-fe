import React from 'react';
import { Heart, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export interface EventCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerUrl: string;
  location: string;
  startTime: string;
  endTime: string;
  status: string;
  price?: number;
  isFree?: boolean;
  isLiked?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  slug,
  description,
  bannerUrl,
  location,
  startTime,
  endTime,
  status,
  price,
  isFree,
  isLiked = false,
}) => {
  const getEventStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) {
      return {
        color: 'bg-blue-500',
        text: 'Sắp diễn ra'
      };
    } else if (now >= start && now <= end) {
      return {
        color: 'bg-green-500',
        text: 'Đang diễn ra'
      };
    } else {
      return {
        color: 'bg-gray-500',
        text: 'Đã kết thúc'
      };
    }
  };

  const eventStatus = getEventStatus(startTime, endTime);

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
          <span className={`${eventStatus.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
            {eventStatus.text}
          </span>
        </div>
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
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
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Kết thúc: {formatDate(endTime)}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          {isFree ? (
            <span className="text-green-600 font-bold text-lg">Miễn phí</span>
          ) : (
            <span className="text-purple-700 font-bold text-lg">{price ? `${price.toLocaleString()} ₫` : 'Giá liên hệ'}</span>
          )}
        </div>
        <Link href={`/client/events/${slug}`}>
          <button className="w-full bg-purple-700 text-white py-2 rounded-lg font-medium hover:bg-purple-800 transition-colors">
            Xem chi tiết
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
