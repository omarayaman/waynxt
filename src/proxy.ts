import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check for the access token in cookies
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Define routes that require authentication
  const protectedRoutes = ['/profile', '/planner', '/ask-waynx'];

  // Check if the current path starts with any of the protected routes
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Continue the request if authenticated or route is not protected
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except api routes, _next static files, images, and favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
