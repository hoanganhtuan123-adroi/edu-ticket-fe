"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService, LoginCredentials } from '@/service/auth.service';

export interface UserAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    userId: string;
    email: string;
    role: 'USER';
  } | null;
  error: string | null;
  token: string | null;
}

// Cookie helper functions
const setUserCookie = (token: string) => {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    const isSecure = window.location.protocol === 'https:';
    document.cookie = `USER=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict${isSecure ? '; Secure' : ''}`;
  }
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

const clearUserCookie = () => {
  if (typeof window !== 'undefined') {
    document.cookie = `USER=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const useUserAuth = () => {
  const [state, setState] = useState<UserAuthState>({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error: null,
    token: null,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Check existing user cookie on mount
  const checkAuth = useCallback(() => {
    const token = getUserCookie();
    if (!token) {
      setState(prev => ({ ...prev, isAuthenticated: false, user: null, token: null }));
      return;
    }

    // Verify token with backend
    authService.verifyToken(token).then(response => {
      if (response.success && response.data?.payload?.role === 'USER') {
        const payload = response.data.payload;
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: {
            userId: payload.userId,
            email: payload.email,
            role: 'USER'
          },
          token: token,
          error: null,
        }));
      } else {
        clearUserCookie();
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          token: null,
        }));
      }
    }).catch(() => {
      clearUserCookie();
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
      
      if (!verifyResponse.success || !verifyResponse.data?.payload) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: verifyResponse.message || 'Token verification failed',
        }));
        return;
      }

      const payload = verifyResponse.data.payload;

      // Step 3: Verify role is USER
      if (payload.role !== 'USER') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Access denied: Not a user account',
        }));
        return;
      }

      // Step 4: Set user cookie
      setUserCookie(token);

      // Step 5: Update state
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: {
          userId: payload.userId,
          email: payload.email,
          role: 'USER'
        },
        token: token,
        error: null,
      }));

      toast.success('User login successful!');
      
      // Step 6: Redirect to dashboard
      router.push('/dashboard');

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
    clearUserCookie();
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
    }));
    router.push('/login');
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
