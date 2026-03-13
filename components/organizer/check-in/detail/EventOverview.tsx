import React from "react";
import { Calendar, Clock, MapPin, BadgeCheck } from "lucide-react";

interface EventOverviewProps {
  event: {
    title: string;
    date: string;
    time: string;
    location: string;
    status: string;
  };
}

const EventOverview: React.FC<EventOverviewProps> = ({ event }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ongoing":
        return "Đang diễn ra";
      case "upcoming":
        return "Sắp bắt đầu";
      case "completed":
        return "Đã kết thúc";
      default:
        return "Chờ duyệt";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            event.status
          )}`}
        >
          {getStatusText(event.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ngày diễn ra</p>
            <p className="font-medium text-gray-900">{event.date}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Thời gian</p>
            <p className="font-medium text-gray-900">{event.time}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-purple-50 p-3 rounded-lg">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Địa điểm</p>
            <p className="font-medium text-gray-900">{event.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventOverview;
