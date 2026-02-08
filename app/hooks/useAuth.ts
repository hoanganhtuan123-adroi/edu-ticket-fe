"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService, LoginCredentials } from '../service/admin/auth.service';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
  token: string | null;
  decodedToken: any | null;
}

// Simple JWT decode function
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error: null,
    token: null,
    decodedToken: null,
  });

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Check if user is authenticated on mount
  const checkAuth = useCallback(async () => {
    let token = null;
    
    if (typeof window !== 'undefined') {
      // First try to get USER_ADMIN cookie (for admin users)
      const cookies = document.cookie.split(';');
      const adminCookie = cookies.find(cookie => cookie.trim().startsWith('USER_ADMIN='));
      if (adminCookie) {
        token = adminCookie.split('=')[1];
      }
      
      // If no admin cookie, try regular token cookie
      if (!token) {
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }
      
      // Finally, try localStorage
      if (!token) {
        token = localStorage.getItem('token');
      }
      
      // Update localStorage if we found token in cookies
      if (token) {
        localStorage.setItem('token', token);
      }
    }
    
    if (!token) {
      setState(prev => ({ ...prev, isAuthenticated: false, user: null, token: null, decodedToken: null }));
      return;
    }

    // Decode token and set it in state
    const decodedToken = decodeJWT(token);
    
    // Set user state from decoded token (no API call)
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      user: { id: decodedToken?.sub || '', username: '', email: decodedToken?.email || '', role: decodedToken?.role || '' },
      token: token,
      decodedToken: decodedToken,
      error: null,
    }));
  }, []);

  // Run checkAuth when component mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.adminLogin(credentials);
      
      if (response.success && response.data?.accessToken) {
        // Decode JWT token to get user info
        const decodedToken = decodeJWT(response.data.accessToken);
        const accessToken = response.data.accessToken;
        
        // Save token to both localStorage and cookie
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', accessToken);
          
          // Save full token as USER_ADMIN if role is admin, otherwise save as regular token
          if (decodedToken?.role === 'ADMIN') {
            document.cookie = `USER_ADMIN=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure`;
          } else {
            document.cookie = `token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure`;
          }
        }
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: true,
          user: response.data?.user || { id: decodedToken?.sub || '', username: '', email: decodedToken?.email || '', role: decodedToken?.role || '' },
          token: accessToken,
          decodedToken: decodedToken,
          error: null,
        }));

        toast.success('Đăng nhập thành công! Đang chuyển hướng...', {
          duration: 3000,
        });

        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);

        return response;
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        decodedToken: null,
        error: errorMessage,
      }));

      toast.error(errorMessage, {
        duration: 4000,
      });
    }
  }, [router]);

  // Submit login form
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    await login({ email, password });
  };

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if API call fails, continue with logout
      console.error('Logout API failed:', error);
    }
    
    // Clear token from localStorage and all cookies
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
      document.cookie = 'USER_ADMIN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
    }
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      isAuthenticated: false,
      user: null,
      token: null,
      decodedToken: null,
      error: null,
    }));

    toast.success('Đăng xuất thành công');
    router.push('/admin/login');
  }, [router]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Auth state
    ...state,
    
    // Auth actions
    login,
    logout,
    checkAuth,
    clearError,
    
    // Login form state
    email,
    password,
    setEmail,
    setPassword,
    submit,
  };
};
