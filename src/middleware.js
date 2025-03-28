import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export function middleware(request) {
  const role = request.cookies.get('role')?.value
  const url = request.nextUrl.clone();
  if (role !== 'student' && role !== 'admin' && url.pathname !== '/login') {
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  } else if (role === 'student') {
    url.pathname = "/user";
    return NextResponse.rewrite(url);
  } else if (role === 'admin') {
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml).*)"
}