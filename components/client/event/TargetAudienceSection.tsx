import { Target } from "lucide-react";

interface TargetAudienceSectionProps {
  targetAudience: string;
}

const TargetAudienceSection = ({ targetAudience }: TargetAudienceSectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-green-600" />
        Đối tượng tham gia
      </h3>
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <p className="text-gray-700 leading-relaxed">{targetAudience}</p>
      </div>
    </div>
  );
};

export default TargetAudienceSection;
