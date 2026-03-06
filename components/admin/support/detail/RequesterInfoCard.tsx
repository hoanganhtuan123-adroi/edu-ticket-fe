import { User, UserCheck, Mail, Phone, Building } from 'lucide-react';
import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface RequesterInfoCardProps {
  requester: SupportRequestDetailResponseDto['requester'];
}

export function RequesterInfoCard({ requester }: RequesterInfoCardProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <User className="w-5 h-5 inline mr-2" />
          Thông tin người yêu cầu
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {requester?.fullName}
              </p>
              <p className="text-sm text-gray-500">
                {requester?.systemRole}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{requester?.email}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{requester?.phoneNumber}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Building className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{requester?.faculty}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
