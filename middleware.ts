import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get('subscribed_user');

  if (!cookie || cookie.value !== 'active') {
    const url = req.nextUrl.clone();
    url.pathname = '/subscribe';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};