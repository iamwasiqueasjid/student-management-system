import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '../lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  console.log('Middleware - Path:', pathname, 'Token present:', !!token);

  // Public routes
  const isPublicRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  
  // If on public route and has token, redirect to dashboard
  if (isPublicRoute && token) {
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, request.url));
    }
  }

  // If not on public route and no token, redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token and check role-based access
  if (token && !isPublicRoute) {
    const payload = await verifyToken(token);
    
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // Check if teacher is approved
    if (payload.role === 'teacher' && !payload.approved) {
      if (!pathname.startsWith('/pending-approval')) {
        return NextResponse.redirect(new URL('/pending-approval', request.url));
      }
    }

    // Role-based route protection
    const role = payload.role as string;
    
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    
    if (pathname.startsWith('/teacher') && role !== 'teacher') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    
    if (pathname.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};