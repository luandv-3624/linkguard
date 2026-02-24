// proxy.ts (root level)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for auth routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');

  // No tokens → redirect to login for protected routes
  if (!accessToken && !refreshToken) {
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Has access token → allow access
  if (accessToken) {
    // If on login page and authenticated → redirect to dashboard
    if (pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log('[Middleware] Access token present, allowing access');
    return NextResponse.next();
  }

  // No access token but has refresh token → try to refresh
  if (refreshToken) {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          Cookie: `refresh_token=${refreshToken.value}`,
        },
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.ok) {
        // Parse cookies from response
        const cookies = response.headers.get('set-cookie');

        const nextResponse = NextResponse.next();

        // Forward new cookies to browser
        if (cookies) {
          // Parse and set each cookie
          const cookieArray = cookies.split(',').map((c) => c.trim());
          cookieArray.forEach((cookie) => {
            const [nameValue] = cookie.split(';');
            const [name, value] = nameValue.split('=');
            if (name === 'access_token') {
              nextResponse.cookies.set('access_token', value, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60, // 15 minutes
                path: '/',
              });
            }
          });
        }

        return nextResponse;
      } else {
        // Refresh failed → clear cookies and redirect
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        return response;
      }
    } catch (error) {
      console.error('[Middleware] Token refresh failed:', error);

      // Clear cookies and redirect on error
      if (pathname.startsWith('/dashboard')) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

// ✅ Config is separate export
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
