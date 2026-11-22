import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'sid';

/**
 * Sends visitors without a session cookie to /login (FR-01).
 * This is only a convenience redirect: the API checks every request itself,
 * and pages also handle a 401 if the cookie has expired.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === '/login' || request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = pathname === '/' ? '' : `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except API calls, Next.js assets and static files.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
