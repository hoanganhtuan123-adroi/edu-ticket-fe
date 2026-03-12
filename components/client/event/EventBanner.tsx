import { Calendar } from "lucide-react";

interface EventBannerProps {
  bannerUrl?: string;
  title: string;
  status: {
    color: string;
    text: string;
  };
}

const EventBanner = ({ bannerUrl, title, status }: EventBannerProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="relative">
        <img
          src={bannerUrl || "/api/placeholder/1200/400"}
          alt={title}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`${status.color} text-white px-4 py-2 rounded-full text-sm font-medium`}
          >
            {status.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
