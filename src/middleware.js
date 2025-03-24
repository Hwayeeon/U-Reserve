import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|login).*)"
}