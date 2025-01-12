import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define the role redirects type
type RoleRedirects = {
  client: string;
  admin: string;
  counselor: string;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/me`, {
      headers: {
        Cookie: `access_token=${accessToken?.value}`,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.redirect(new URL('/signin', process.env.NEXT_PUBLIC_APP_URL));
    }

    const roleRedirects: RoleRedirects = {
      client: '/dashboard',
      admin: '/admin',
      counselor: '/counselor'
    };

    // Type guard to check if the role is valid
    const isValidRole = (role: string): role is keyof RoleRedirects => {
      return role in roleRedirects;
    };

    const userRole = data.user.role;
    const redirectPath = isValidRole(userRole) ? roleRedirects[userRole] : '/signin';
    
    return NextResponse.redirect(new URL(redirectPath, process.env.NEXT_PUBLIC_APP_URL));
  } catch (error) {
    return NextResponse.redirect(new URL('/signin', process.env.NEXT_PUBLIC_APP_URL));
  }
}