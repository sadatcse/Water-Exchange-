import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { safeRedirect } from '@/lib/redirect';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ALLOWED_ORIGINS = [SITE_URL, 'http://localhost:3000', 'http://localhost:3001'];

// Session payload ({ _id, email, name, role }) or null
function readSession(token) {
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function redirectToLogin(request, pathname, hadToken) {
  const loginUrl = new URL('/admin', request.url);
  loginUrl.searchParams.set('from', pathname + request.nextUrl.search);
  const response = NextResponse.redirect(loginUrl);
  if (hadToken) response.cookies.delete('token');
  return response;
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. CORS for /api routes (role checks happen inside each route)
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const corsOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : SITE_URL;

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', corsOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  const token = request.cookies.get('token')?.value;
  const session = readSession(token);

  // 2. /dashboard → admins only
  if (pathname.startsWith('/dashboard') && (!session || session.role !== 'admin')) {
    return redirectToLogin(request, pathname, Boolean(token));
  }

  // 3. Signed-in admins skip the login page
  if (pathname === '/admin' && session?.role === 'admin') {
    const target = safeRedirect(request.nextUrl.searchParams.get('from'), session.role, '/dashboard');
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/admin'],
};
