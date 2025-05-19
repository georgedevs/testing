import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/signin', '/signup', '/forgot-password', '/reset-password', '/about', '/resources', '/stories'];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = publicRoutes.includes(path);

    if (isPublicPath) {
        return NextResponse.next();
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