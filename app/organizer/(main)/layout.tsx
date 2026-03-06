"use client";

import { useEffect, useState } from "react";
import { useOrganizerAuth } from "@/hooks/auth/useOrganizerAuth";
import OrganizerHeader from "@/components/organizer/layout/OrganizerHeader";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated, checkAuth, isLoading } = useOrganizerAuth();

  useEffect(() => {
    setIsClient(true);
    checkAuth();
  }, [checkAuth]);

  if (!isClient) {
    return <div className="min-h-screen">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-gray-600 mb-4">Bạn cần đăng nhập để truy cập trang này</p>
  //         <a
  //           href="/organizer/login"
  //           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
  //         >
  //           Đăng nhập
  //         </a>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen">
      {/* {isAuthenticated && <OrganizerHeader />} */}
      <OrganizerHeader />
      <div className="p-6">{children}</div>
    </div>
  );
}
