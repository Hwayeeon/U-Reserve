import { NextResponse } from 'next/server'
import { createClient } from './server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  
  const url = request.nextUrl.clone();
  const supabase = await createClient();

  // const { data } = await supabase.auth.getSession();
  const { data } = await supabase.auth.getUser();

  // const role = data?.session?.user.user_metadata.role;
  const role = data?.user?.user_metadata?.role;

  if (url.pathname !== 'login' && role !== 'admin' && role !== 'student') {
    url.pathname = '/login';
    return NextResponse.rewrite(url);
  } else if (role === 'student') {
    if (url.pathname.match("/user/")) {
      return NextResponse.rewrite(url);
    }
    url.pathname = "/user";
    return NextResponse.rewrite(url);
  } else if (role === 'admin') {
    return NextResponse.rewrite(url);
  }

  // if (
  //   !user &&
  //   !request.nextUrl.pathname.startsWith('/login') &&
  //   !request.nextUrl.pathname.startsWith('/auth')
  // ) {
  //   // no user, potentially respond by redirecting the user to the login page
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}