import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/signin', '/signup', '/forgot-password', '/reset-password', '/about', '/resources', '/stories'];

export async function middleware(request: NextRequest) {

  const headers = new Headers(request.headers);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'interest-cohort=()');

  const path = request.nextUrl.pathname;
  const isPublicPath = publicRoutes.includes(path);
  const token = request.cookies.get('access_token')?.value || '';

  try {
    // Try to validate the token with the server
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/validate-token`, {
          headers: {
            Cookie: `access_token=${token}`,
          },
          next: { revalidate: 0 }, // Disable cache for this request
        });

        if (!response.ok) {
          // If token validation fails, clear the token and redirect to login
          const response = NextResponse.redirect(new URL('/signin', request.url));
          response.cookies.delete('access_token');
          return response;
        }
      } catch (error) {
        // If we can't reach the server (offline), allow the request to continue
        // The client-side OfflineStatusHandler will handle showing the offline UI
        return NextResponse.next();
      }
    }

    // Regular redirect logic
    if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (isPublicPath && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If any other error occurs, proceed to client-side handling
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/dashboard',
    '/admin',
    '/counselor',
    '/forgot-password',
    '/reset-password',
    '/resources/:path*',
    '/stories'
  ]
};