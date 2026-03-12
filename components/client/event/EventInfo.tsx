import { Calendar, MapPin } from "lucide-react";

interface EventInfoProps {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  category?: {
    name: string;
  };
  description: string;
  formatDate: (dateString: string) => string;
}

const EventInfo = ({
  title,
  startTime,
  endTime,
  location,
  category,
  description,
  formatDate,
}: EventInfoProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-5 h-5 mr-2" />
          <span>Bắt đầu: {formatDate(startTime)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-5 h-5 mr-2" />
          <span>Kết thúc: {formatDate(endTime)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{location}</span>
        </div>
      </div>

      {category && (
        <div className="mb-6">
          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            {category.name}
          </span>
        </div>
      )}

      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Mô tả sự kiện
        </h2>
        <div className="text-gray-700 whitespace-pre-wrap">{description}</div>
      </div>
    </div>
  );
};

export default EventInfo;
