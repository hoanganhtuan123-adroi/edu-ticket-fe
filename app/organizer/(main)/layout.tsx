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
  return (
    <div className="min-h-screen">
      {/* {isAuthenticated && <OrganizerHeader />} */}
      <OrganizerHeader />
      <div className="p-6">{children}</div>
    </div>
  );
}
