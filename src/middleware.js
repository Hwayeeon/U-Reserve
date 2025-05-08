import { NextResponse } from 'next/server'
import { decrypt, decryptRole } from "@/lib/crypt"

export function middleware(request) {
  const role = request.cookies.get('role')?.value;
  const user = request.cookies.get('user')?.value;
  const decryptedUser = JSON.parse(decrypt(user));
  const decryptedRole = decryptRole(role, decryptedUser?.email, decryptedUser?.name);
  const url = request.nextUrl.clone();
  
  if (decryptedRole !== 'Student' && decryptedRole !== 'Admin' && url.pathname !== '/login') {
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  } else if (decryptedRole === 'Student') {
    if (url.pathname.match("/user/")) {
      return NextResponse.rewrite(url);
    }
    url.pathname = "/user";
    return NextResponse.rewrite(url);
  } else if (decryptedRole === 'Admin') {
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml).*)"
}