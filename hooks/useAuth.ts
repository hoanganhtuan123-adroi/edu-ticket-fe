"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService, LoginCredentials } from '@/service/admin/auth.service';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
  token: string | null;
  decodedToken: any | null;
}

// Cookie helper functions
const clearAuthCookie = (cookieName: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

const setAuthCookie = (cookieName: string, value: string) => {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    document.cookie = `${cookieName}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Strict; Secure`;
  }
};

const clearRoleCookie = (userRole: string) => {
  let cookieName = 'USER';
  if (userRole === 'ADMIN') {
    cookieName = 'USER_ADMIN';
  } else if (userRole === 'ORGANIZER') {
    cookieName = 'USER_ORGANIZER';
  }
  clearAuthCookie(cookieName);
};

const clearAllAuthCookies = () => {
  clearAuthCookie('USER_ADMIN');
  clearAuthCookie('USER_ORGANIZER');
  clearAuthCookie('USER');
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Check if user is authenticated on mount
  const checkAuth = useCallback(async () => {
    let token = null;
    let tokenType = '';
    
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      
      // Check for USER_ADMIN cookie first
      const adminCookie = cookies.find(cookie => cookie.trim().startsWith('USER_ADMIN='));
      if (adminCookie) {
        token = adminCookie.split('=')[1];
        tokenType = 'USER_ADMIN';
      } else {
        const organizerCookie = cookies.find(cookie => cookie.trim().startsWith('USER_ORGANIZER='));
        if (organizerCookie) {
          token = organizerCookie.split('=')[1];
          tokenType = 'USER_ORGANIZER';
        } else {
          const userCookie = cookies.find(cookie => cookie.trim().startsWith('USER='));
          if (userCookie) {
            token = userCookie.split('=')[1];
            tokenType = 'USER';
          }
        }
      }
    }
    
    if (!token) {
      setState(prev => ({ ...prev, isAuthenticated: false, user: null, token: null, decodedToken: null }));
      return;
    }

    try {
      const response = await authService.verifyToken(token);
      
      // ✅ FIX: Kiểm tra response.success trước
      if (response.success && response.data?.payload) {
        const payload = response.data.payload;
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: { 
            id: payload.userId, 
            username: '', 
            email: payload.email, 
            role: payload.role 
          },
          token: token,
          decodedToken: payload,
          error: null,
        }));
      } else {
        clearAuthCookie(tokenType);
        setState(prev => ({ 
          ...prev, 
          isAuthenticated: false, 
          user: null, 
          token: null, 
          decodedToken: null 
        }));
      }
    } catch (error) {
      clearAuthCookie(tokenType);
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false, 
        user: null, 
        token: null, 
        decodedToken: null 
      }));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ FIXED: Login function với validation đầy đủ
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Bước 1: Gọi API login
    const loginResponse = await authService.login(credentials);
    
    console.log('Login response:', loginResponse);
    
    // ✅ FIX 1: Kiểm tra success ngay từ đầu
    if (!loginResponse.success) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        decodedToken: null,
        error: loginResponse.message,
      }));
      return;
    }
    
    // ✅ FIX 2: Kiểm tra accessToken có tồn tại không
    const accessToken = loginResponse.data?.accessToken;
    if (!accessToken) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        decodedToken: null,
        error: 'Không nhận được access token từ server',
      }));
      return;
    }
    
    // Bước 2: Verify token để lấy thông tin user
    const verifyResponse = await authService.verifyToken(accessToken);
    
    console.log('Verify response:', verifyResponse);
    
    // ✅ FIX 3: Kiểm tra verify response
    if (!verifyResponse.success) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        decodedToken: null,
        error: verifyResponse.message,
      }));
      return;
    }
    
    // ✅ FIX 4: Kiểm tra payload có đầy đủ dữ liệu không
    const payload = verifyResponse.data?.payload;
    if (!payload || !payload.role || !payload.userId || !payload.email) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        decodedToken: null,
        error: 'Dữ liệu người dùng không hợp lệ',
      }));
      return;
    }
    
    const userRole = payload.role;
    
    // Bước 3: Lưu token vào cookie dựa trên role
    if (typeof window !== 'undefined') {
      clearRoleCookie(userRole);
      
      let cookieName = 'USER';
      if (userRole === 'ADMIN') {
        cookieName = 'USER_ADMIN';
      } else if (userRole === 'ORGANIZER') {
        cookieName = 'USER_ORGANIZER';
      }
      
      setAuthCookie(cookieName, accessToken);
    }
    
    // Bước 4: Cập nhật state
    setState(prev => ({
      ...prev,
      isLoading: false,
      isAuthenticated: true,
      user: { 
        id: payload.userId, 
        email: payload.email, 
        role: userRole 
      },
      token: accessToken,
      decodedToken: payload,
      error: null,
    }));

    toast.success('Đăng nhập thành công! Đang chuyển hướng...', {
      duration: 3000,
    });

    // Bước 5: Redirect dựa trên role
    setTimeout(() => {
      switch (userRole) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'ORGANIZER':
          router.push('/organizer/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    }, 1500);

    return loginResponse;
    
  }, [router]);

  // Submit login form
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ FIX 6: Validate input trước khi gọi login
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    
    // ✅ FIX 7: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    await login({ email, password });
  };

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    
    clearAllAuthCookies();
    
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
    router.push('/login');
  }, [router]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    checkAuth,
    clearError,
    email,
    password,
    setEmail,
    setPassword,
    submit,
  };
};