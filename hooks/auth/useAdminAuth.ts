"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService, LoginCredentials } from '@/service/auth.service';

export interface AdminAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    userId: string;
    email: string;
    role: 'ADMIN';
  } | null;
  error: string | null;
  token: string | null;
}

// Cookie helper functions
const setAdminCookie = (token: string) => {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    const isSecure = window.location.protocol === 'https:';
    console.log('Setting cookie with params:', {
      token: token.substring(0, 20) + '...',
      expires: expires.toUTCString(),
      isSecure,
      domain: window.location.hostname
    });
    document.cookie = `USER_ADMIN=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
    console.log('Cookie set. Current cookies:', document.cookie);
  }
};

const getAdminCookie = (): string | null => {
  if (typeof window !== 'undefined') {
    console.log('Getting admin cookie. All cookies:', document.cookie);
    const cookies = document.cookie.split(';');
    const adminCookie = cookies.find(cookie => cookie.trim().startsWith('USER_ADMIN='));
    console.log('Found admin cookie:', adminCookie ? 'YES' : 'NO');
    if (adminCookie) {
      const token = adminCookie.split('=')[1];
      console.log('Token length:', token.length);
      return token;
    }
  }
  return null;
};

const clearAdminCookie = () => {
  if (typeof window !== 'undefined') {
    document.cookie = `USER_ADMIN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error: null,
    token: null,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Check existing admin cookie on mount
  const checkAuth = useCallback(() => {
    const token = getAdminCookie();
    if (!token) {
      setState(prev => ({ ...prev, isAuthenticated: false, user: null, token: null }));
      return;
    }

    // Verify token with backend
    authService.verifyToken(token).then(response => {
      const payload = response.payload || response.data?.payload;
      if (payload && payload.role === 'ADMIN') {
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: {
            userId: payload.userId,
            email: payload.email,
            role: 'ADMIN'
          },
          token: token,
          error: null,
        }));
      } else {
        clearAdminCookie();
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          token: null,
        }));
      }
    }).catch(() => {
      clearAdminCookie();
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        token: null,
      }));
    });
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Step 1: Call POST /auth/login
      const loginResponse = await authService.login(credentials);
      if (!loginResponse.success || !loginResponse.data?.accessToken) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: loginResponse.message || 'Login failed',
        }));
        return;
      }

      const token = loginResponse.data.accessToken;

      // Step 2: Immediately call GET /auth/verify
      const verifyResponse = await authService.verifyToken(token);

      if (!verifyResponse || !verifyResponse.payload) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Token verification failed',
        }));
        return;
      }

      const payload = verifyResponse.payload;

      // Step 3: Verify role is ADMIN
      if (payload.role !== 'ADMIN') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Access denied: Not an admin account',
        }));
        return;
      }

      // Step 4: Set admin cookie
      setAdminCookie(token);

      // Step 5: Update state
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: {
          userId: payload.userId,
          email: payload.email,
          role: 'ADMIN'
        },
        token: token,
        error: null,
      }));

      toast.success('Admin login successful!');

      // Step 6: Redirect to admin dashboard with a small delay to ensure cookie is set
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 100);

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }));
    }
  }, [router]);

  // Logout function
  const logout = useCallback(() => {
    clearAdminCookie();
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
    }));
    router.push('/admin/login');
  }, [router]);

  // Submit form handler
  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  }, [email, password, login]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    email,
    password,
    setEmail,
    setPassword,
    login,
    logout,
    submit,
    clearError,
    checkAuth,
  };
};
