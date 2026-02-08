import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface TokenPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'ORGANIZER' | 'USER';
}

interface VerifyResponse {
  success: boolean;
  message: string;
  data?: {
    payload: {
      userId: string;
      email: string;
      role: string;
    };
  };
  timestamp?: string;
}

// Verify token with backend API
async function verifyTokenWithBackend(token: string): Promise<TokenPayload | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data: VerifyResponse = await response.json();
    
    if (data.success && data.data?.payload) {
      return {
        id: data.data.payload.userId,
        email: data.data.payload.email,
        role: data.data.payload.role as 'ADMIN' | 'ORGANIZER' | 'USER'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Helper function to create response with cleared cookies (only for invalid tokens)
const createClearCookieResponse = (cookieName: string, redirectUrl: string, request: NextRequest) => {
  const response = NextResponse.redirect(new URL(redirectUrl, request.url));
  // Clear cookie with multiple approaches
  response.cookies.set(cookieName, '', {
    path: '/',
    expires: new Date(0),
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
  });
  response.cookies.set(cookieName, '', {
    path: '/',
    expires: new Date(0),
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
  });
  return response;
};

// Helper function for simple redirect without clearing cookies
const createRedirectResponse = (redirectUrl: string, request: NextRequest) => {
  return NextResponse.redirect(new URL(redirectUrl, request.url));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get role-based tokens from cookies
  const adminToken = request.cookies.get('USER_ADMIN')?.value;
  const organizerToken = request.cookies.get('USER_ORGANIZER')?.value;
  const userToken = request.cookies.get('USER')?.value;
  
  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    // If accessing admin/login and already has admin token, redirect to dashboard
    if (pathname === '/admin/login' && adminToken) {
      const decoded = await verifyTokenWithBackend(adminToken);
      if (decoded && decoded.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    
    // If accessing other admin routes, check for admin token
    if (pathname !== '/admin/login') {
      if (!adminToken) {
        return createRedirectResponse('/admin/login', request);
      }
      
      const decoded = await verifyTokenWithBackend(adminToken);
      if (!decoded || decoded.role !== 'ADMIN') {
        return createClearCookieResponse('USER_ADMIN', '/admin/login', request);
      }
      
      // Add user info to headers and continue
      const response = NextResponse.next();
      response.headers.set('x-user-id', decoded.id);
      response.headers.set('x-user-email', decoded.email);
      response.headers.set('x-user-role', decoded.role);
      return response;
    }
  }
  
  // Organizer routes protection
  if (pathname.startsWith('/organizer')) {
    // If accessing organizer/login and already has organizer token, redirect to dashboard
    if (pathname === '/organizer/login' && organizerToken) {
      const decoded = await verifyTokenWithBackend(organizerToken);
      if (decoded && decoded.role === 'ORGANIZER') {
        return NextResponse.redirect(new URL('/organizer/dashboard', request.url));
      }
    }
    
    // If accessing other organizer routes, check for organizer token
    if (pathname !== '/organizer/login') {
      if (!organizerToken) {
        return createRedirectResponse('/organizer/login', request);
      }
      
      const decoded = await verifyTokenWithBackend(organizerToken);
      if (!decoded || decoded.role !== 'ORGANIZER') {
        return createClearCookieResponse('USER_ORGANIZER', '/organizer/login', request);
      }
      
      // Add user info to headers and continue
      const response = NextResponse.next();
      response.headers.set('x-user-id', decoded.id);
      response.headers.set('x-user-email', decoded.email);
      response.headers.set('x-user-role', decoded.role);
      return response;
    }
  }
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/admin/login',
    '/organizer/login',
    '/client/login',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/auth/verify'
  ];
  
  // Check if the path is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // For protected routes, check for user token
  if (userToken) {
    const decoded = await verifyTokenWithBackend(userToken);
    if (decoded) {
      // Add user info to headers and continue
      const response = NextResponse.next();
      response.headers.set('x-user-id', decoded.id);
      response.headers.set('x-user-email', decoded.email);
      response.headers.set('x-user-role', decoded.role);
      return response;
    } else {
      // Token is invalid, clear it and redirect to login
      return createClearCookieResponse('USER', '/login', request);
    }
  } else {
    // No token found, redirect to login
    return createRedirectResponse('/login', request);
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
