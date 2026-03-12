"use client";

import { useState } from 'react';
import RouteGuard from '@/hooks/auth/RouteGuard';
import DashboardHeader from '@/components/client/layout/DashboardHeader';

export default function ClientMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteGuard requiredRole="USER" fallbackPath="/client/login">
      <div className="min-h-screen">
        {/* Header */}
        <DashboardHeader />

        {/* Main content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}
