import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard, { EventCardProps } from './EventCard';

export interface FeaturedEventsProps {
  events: EventCardProps[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasNext?: boolean;
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ 
  events, 
  loading = false, 
  onLoadMore,
  hasNext = false 
}) => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sự kiện nổi bật</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

      {loading && (
        <div className="text-center mt-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      )}

      {!loading && hasNext && onLoadMore && (
        <div className="text-center mt-8">
          <button 
            onClick={onLoadMore}
            className="bg-purple-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-800 transition-colors"
          >
            Xem thêm sự kiện
          </button>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600">Không có sự kiện nào phù hợp.</p>
        </div>
      )}
    </section>
  );
};

export default FeaturedEvents;
