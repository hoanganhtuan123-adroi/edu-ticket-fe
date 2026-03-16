"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Import hooks
import { useEventRegistrations } from "@/hooks/organizer/useEventRegistrations";

// Import components
import RegistrationStats from "@/components/organizer/events/registration/RegistrationStats";
import RegistrationFilters from "@/components/organizer/events/registration/RegistrationFilters";
import RegistrationTabs from "@/components/organizer/events/registration/RegistrationTabs";
import RegistrationTable from "@/components/organizer/events/registration/RegistrationTable";
import RegistrationPagination from "@/components/organizer/events/registration/RegistrationPagination";

export default function RegisterEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventSlug = params['slug-event'] as string;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);

  const limit = 10;

  const {
    registrations,
    stats,
    pagination,
    isLoading,
    error,
    getEventRegistrations,
    refreshStats,
    approveRegistration,
    rejectRegistration,
    bulkApproveRegistrations
  } = useEventRegistrations();

  const fetchRegistrations = async () => {
    const offset = (currentPage - 1) * limit;
    const filters: any = {
      limit,
      offset,
    };

    // Add search filter
    if (searchTerm) {
      filters.title = searchTerm;
    }

    // Add status filter based on active tab
    if (activeTab !== "all") {
      const statusMap = {
        "pending": "PENDING",
        "approved": "PAID", 
        "rejected": "REJECTED"
      };
      filters.status = statusMap[activeTab as keyof typeof statusMap];
    }

    await getEventRegistrations(eventSlug, filters);
  };

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, activeTab]);

  const totalPages = Math.ceil(pagination.total / limit);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchTrigger = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchRegistrations();
  };

  const handleViewDetails = (registrationId: string) => {
    // Navigate to registration details
    router.push(`/organizer/register-event/${eventSlug}/registration/${registrationId}`);
  };

  const handleApprove = async (bookingCode: string) => {
    const success = await approveRegistration(bookingCode);
    if (success) {
      fetchRegistrations();
      refreshStats(eventSlug); // Refresh stats after approval
    }
  };

  const handleReject = async (bookingCode: string) => {
    const success = await rejectRegistration(bookingCode);
    if (success) {
      fetchRegistrations();
      refreshStats(eventSlug); // Refresh stats after rejection
    }
  };

  const handleBulkApprove = async (bookingCodes: string[]) => {
    try {
      console.log(`Booking Code ::: ${bookingCodes}`)
      const success = await bulkApproveRegistrations(bookingCodes);
      if (success) {
        fetchRegistrations();
        refreshStats(eventSlug);
        toast.success(`Đã duyệt ${bookingCodes.length} đăng ký thành công`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Duyệt hàng loạt đăng ký thất bại');
    }
  };

  if (isLoading && registrations.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-sm lg:text-base">
              Đang tải danh sách đăng ký...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đăng ký</h1>
        <p className="text-gray-600">Xem và duyệt các đơn đăng ký tham gia sự kiện</p>
      </div>

      {/* Stats Cards */}
      <RegistrationStats 
        total={stats.total}
        pending={stats.pending}
        approvalRate={stats.approvalRate}
      />

      {/* Search and Filters */}
      <RegistrationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchTrigger={handleSearchTrigger}
      />

      {/* Tabs */}
      <RegistrationTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        stats={stats}
      />

      {/* Table */}
      <RegistrationTable
        registrations={registrations}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        onBulkApprove={handleBulkApprove}
      />

      {/* Pagination */}
      <RegistrationPagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={pagination.total}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
