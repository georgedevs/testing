// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/signin', '/signup', '/forgot-password', '/reset-password', '/about', '/resources', '/stories'];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = publicRoutes.includes(path);

    // Check for token in localStorage (via cookie since we can't access localStorage in middleware)
    const token = request.cookies.get('access_token')?.value || '';

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
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