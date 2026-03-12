import React from "react";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

interface EventInfoProps {
  bannerUrl: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  slug: string;
  formattedDateTime: string;
}

const EventInfo: React.FC<EventInfoProps> = ({
  bannerUrl,
  title,
  startTime,
  endTime,
  location,
  slug,
  formattedDateTime,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sự kiện</h3>

      <div className="flex gap-4 mb-4">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt={title}
            className="w-24 h-24 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{formattedDateTime}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{location}</span>
            </div>
          </div>
        </div>
      </div>

      {slug && (
        <Link
          href={`/client/events/${slug}`}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Xem chi tiết sự kiện
        </Link>
      )}
    </div>
  );
};

export default EventInfo;
