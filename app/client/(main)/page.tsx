"use client";

import { useEffect, useState } from 'react';

export default function ClientPage() {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check for USER cookie
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        const userCookie = cookies.find(cookie => cookie.trim().startsWith('USER='));
        
        if (userCookie) {
          setAuthStatus('Authenticated with USER cookie');
        } else {
          setAuthStatus('Not authenticated - will redirect to login');
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Client Dashboard</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Authentication Status:</p>
          <p className={`text-sm mt-1 ${authStatus.includes('Not') ? 'text-red-600' : 'text-green-600'}`}>
            {authStatus}
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Welcome to Client Portal</h2>
            <p className="text-sm text-blue-700">
              This is a protected client page. If you're not authenticated, you should be automatically redirected to the login page.
            </p>
          </div>

          <div className="text-sm text-gray-600">
            <p>Test authentication:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Visit this page without USER cookie → should redirect to /client/login</li>
              <li>Set USER cookie → should show this page</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
