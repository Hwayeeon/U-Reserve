import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const session = req.cookies.get("user");
  if (!session && req.url !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url)
  } else {
    return NextResponse.next()
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml).*)"
}