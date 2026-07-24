import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the access token in cookies
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Define routes that require authentication
  const protectedRoutes = ['/profile', '/planner', '/chat'];

  // Check if the current path starts with any of the protected routes
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    // We let the client-side ProtectedRoute component handle showing the login modal
    // instead of doing a hard redirect to the deleted /login page.
  }

  // Continue the request if authenticated or route is not protected
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except api routes, _next static files, images, and favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
