import { NextResponse } from 'next/server'
<<<<<<< HEAD
import { decrypt, decryptRole } from "@/lib/crypt"

export function middleware(request) {
  const role = request.cookies.get('role')?.value;
  const user = request.cookies.get('user')?.value;
  const decryptedUser = JSON.parse(decrypt(user));
  const decryptedRole = decryptRole(role, decryptedUser?.email, decryptedUser?.name);
=======

export function middleware(request) {
  const role = request.cookies.get('role')?.value
>>>>>>> parent of 71c0c20 (Merge pull request #21 from Hwayeeon/RPL-14-Session)
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