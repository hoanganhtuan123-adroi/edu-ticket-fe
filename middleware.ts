import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface TokenPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'ORGANIZER' | 'USER';
}

// Simple token validation (in production, use proper JWT verification)
function parseToken(token: string): TokenPayload | null {
  try {
    // This is a simplified version - in production, use proper JWT verification
    // For now, we'll assume the token contains user info in a simple format
    const parts = token.split('.');
    if (parts.length === 3) {
      // JWT format - decode payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role
      };
    }
    
    // Fallback: try parsing as JSON (for development/testing)
    const parsed = JSON.parse(token);
    if (parsed.id && parsed.email && parsed.role) {
      return parsed;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get USER_ADMIN token from cookies first
  const adminToken = request.cookies.get('USER_ADMIN')?.value;
  
  // Special handling for admin routes
  if (pathname.startsWith('/admin')) {
    // If accessing admin/login and already has admin token, redirect to dashboard
    if (pathname === '/admin/login' && adminToken) {
      const decoded = parseToken(adminToken);
      if (decoded && decoded.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    
    // If accessing other admin routes, check for admin token
    if (pathname !== '/admin/login') {
      if (!adminToken) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      const decoded = parseToken(adminToken);
      if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
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
    '/api/auth/refresh'
  ];
  
  // Check if the path is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // For non-admin routes, you can add additional logic here if needed
  
  return NextResponse.next();
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
