import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Building,
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Lock,
  Unlock
} from 'lucide-react';
import { UserDetailResponse } from '@/service/admin/user.service';
import { userService } from '@/service/admin/user.service';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UserDetailProps {
  user: UserDetailResponse;
  onBack: () => void;
  onUserUpdate?: () => void;
}

export default function UserDetail({ user, onBack, onUserUpdate }: UserDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLockUnlockUser = async () => {
    const confirmMessage = currentUser.isActive 
      ? 'Bạn có chắc chắn muốn khóa tài khoản này?' 
      : 'Bạn có chắc chắn muốn mở khóa tài khoản này?';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await userService.lockUnlockUser(currentUser.id, !currentUser.isActive);
      if (response.success) {
        const updatedUser = { ...currentUser, isActive: !currentUser.isActive };
        setCurrentUser(updatedUser);
        toast.success(response.message || (currentUser.isActive ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công'));
        onUserUpdate?.();
      } else {
        throw new Error(response.message || 'Thao tác thất bại');
      }
    } catch (error: any) {
      toast.error(error.message || 'Thao tác thất bại');
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Quản trị viên',
        icon: Shield,
      },
      ORGANIZER: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Ban tổ chức',
        icon: Building,
      },
      USER: {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Người dùng',
        icon: User,
      },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
        isActive 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-red-100 text-red-800 border-red-200'
      }`}>
        {isActive ? (
          <>
            <CheckCircle className="w-3 h-3" />
            Đang hoạt động
          </>
        ) : (
          <>
            <XCircle className="w-3 h-3" />
            Đã khóa
          </>
        )}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Quay lại danh sách</span>
        </button>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentUser.fullName}</h1>
                <p className="text-gray-600">{currentUser.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  {getRoleBadge(currentUser.systemRole)}
                  {getStatusBadge(currentUser.isActive)}
                </div>
              </div>
            </div>
            
            {/* Lock/Unlock Button */}
            <button
              onClick={handleLockUnlockUser}
              disabled={isUpdating}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentUser.isActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : currentUser.isActive ? (
                <>
                  <Lock className="w-4 h-4" />
                  Khóa tài khoản
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  Mở khóa tài khoản
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Thông tin cơ bản
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{currentUser.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium text-gray-900">{currentUser.phoneNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Vai trò</p>
                <div className="mt-1">{getRoleBadge(currentUser.systemRole)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {currentUser.isActive ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Trạng thái</p>
                <div className="mt-1">{getStatusBadge(currentUser.isActive)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Thông tin học thuật
          </h2>
          <div className="space-y-4">
            {currentUser.studentCode && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Mã sinh viên</p>
                  <p className="font-medium text-gray-900">{currentUser.studentCode}</p>
                </div>
              </div>
            )}
            
            {currentUser.faculty && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Khoa</p>
                  <p className="font-medium text-gray-900">{currentUser.faculty}</p>
                </div>
              </div>
            )}
            
            {!currentUser.studentCode && !currentUser.faculty && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không có thông tin học thuật</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timestamp Information */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Thời gian hoạt động
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-medium text-gray-900">
                {currentUser.createdAt ? formatDate(currentUser.createdAt.toString()) : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              <p className="font-medium text-gray-900">
                {currentUser.updatedAt ? formatDate(currentUser.updatedAt.toString()) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
