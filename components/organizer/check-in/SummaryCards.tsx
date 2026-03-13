import React from "react";
import { Calendar, CheckCircle, Ticket, TrendingUp } from "lucide-react";

interface SummaryCardsProps {
  totalEvents: number;
  totalCheckedIn: number;
  totalTickets: number;
  averagePercentage: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalEvents,
  totalCheckedIn,
  totalTickets,
  averagePercentage,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tổng sự kiện</p>
            <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl">
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Đã check-in</p>
            <p className="text-3xl font-bold text-gray-900">{totalCheckedIn}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tổng vé</p>
            <p className="text-3xl font-bold text-gray-900">{totalTickets}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl">
            <Ticket className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tỷ lệ check-in</p>
            <p className="text-3xl font-bold text-gray-900">{averagePercentage}%</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
