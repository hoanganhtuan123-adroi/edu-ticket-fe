import { User } from "lucide-react";

interface Organizer {
  fullName: string;
  email: string;
}

interface OrganizerInfoProps {
  organizer: Organizer;
}

const OrganizerInfo = ({ organizer }: OrganizerInfoProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thông tin ban tổ chức
      </h3>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center mr-3">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{organizer.fullName}</p>
          <p className="text-sm text-gray-600">{organizer.email}</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerInfo;
