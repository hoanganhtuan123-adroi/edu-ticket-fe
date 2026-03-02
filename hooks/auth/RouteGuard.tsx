"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Cookie helper functions
const getAdminCookie = (): string | null => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const adminCookie = cookies.find(cookie => cookie.trim().startsWith('USER_ADMIN='));
    if (adminCookie) {
      return adminCookie.split('=')[1];
    }
  }
  return null;
};

const getOrganizerCookie = (): string | null => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const organizerCookie = cookies.find(cookie => cookie.trim().startsWith('USER_ORGANIZER='));
    if (organizerCookie) {
      return organizerCookie.split('=')[1];
    }
  }
  return null;
};

const getUserCookie = (): string | null => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie => cookie.trim().startsWith('USER='));
    if (userCookie) {
      return userCookie.split('=')[1];
    }
  }
  return null;
};

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole: 'ADMIN' | 'ORGANIZER' | 'USER';
  fallbackPath?: string;
}

export default function RouteGuard({ children, requiredRole, fallbackPath }: RouteGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let hasRequiredCookie = false;

    switch (requiredRole) {
      case 'ADMIN':
        hasRequiredCookie = !!getAdminCookie();
        if (!hasRequiredCookie) {
          router.push(fallbackPath || '/admin/login');
        }
        break;
      case 'ORGANIZER':
        hasRequiredCookie = !!getOrganizerCookie();
        if (!hasRequiredCookie) {
          router.push(fallbackPath || '/organizer/login');
        }
        break;
      case 'USER':
        hasRequiredCookie = !!getUserCookie();
        if (!hasRequiredCookie) {
          router.push(fallbackPath || '/login');
        }
        break;
    }
    
    setIsAuthenticated(hasRequiredCookie);
    setIsLoading(false);
  }, [router, requiredRole, fallbackPath]);

  // Show loading state or nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
