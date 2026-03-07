"use client";

import { useState } from 'react';
import RouteGuard from '@/hooks/auth/RouteGuard';

export default function ClientMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteGuard requiredRole="USER" fallbackPath="/client/login">
      <div className="min-h-screen">
        {/* Mobile sidebar toggle button - can be added later if needed */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Main content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}
