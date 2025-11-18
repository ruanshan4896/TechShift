import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Paths that require authentication
const protectedPaths = ['/dashboard', '/editor', '/rss'];

// Paths that should redirect to dashboard if already authenticated
const authPaths = ['/login', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin-token')?.value;

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.includes(pathname);

  // If accessing protected path without token, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has token, verify it
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      
      // If accessing auth paths with valid token, redirect to dashboard
      if (isAuthPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // Token is valid, allow request
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      console.error('JWT verification failed:', error);
      
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/editor/:path*',
    '/rss/:path*',
  ],
};
