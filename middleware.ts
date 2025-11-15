import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page to be accessed without authentication
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // For all other admin routes, authentication will be checked in the layout
  // The layout will redirect to /admin/login if not authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

