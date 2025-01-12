import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup', '/forgot-password', '/reset-password','/about', '/resources',];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if the path is public
  const isPublicPath = publicRoutes.includes(path)

  // Get the token from cookies
  const token = request.cookies.get('access_token')?.value || ''

  // Redirect logic
  if (!isPublicPath && !token) {
    // If trying to access protected route without token, redirect to login
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (isPublicPath && token) {
    // If trying to access public route with token, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
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
    '/resources/:path*' 
  ]
}