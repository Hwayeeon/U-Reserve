'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from "next/headers";
import { encrypt } from "@/lib/crypt";

export async function login(credentials) {
  const supabase = await createClient()

  const { data:user, error } = await supabase
  .from('users')
  .select('email')
  .eq('user_id', credentials['user_id'])
  .single();

  // Sign-up user
  // const { data:userData, error:userError } = await supabase.auth.signUp({
  //   email: user.email,
  //   password: credentials['password_hash'],
  //   options:{
  //     data: {
  //       user_id: credentials['user_id'],
  //       username: user.username,
  //       email: user.email,
  //       prodi: user.prodi,
  //       role: user.role,
  //       avatar: user.avatar
  //     },
  //   }
  // })
  // console.log('\nlogin\n', userData, userError);

  const cookieStore = await cookies();
  const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: credentials['password_hash'],
  })
  
  if (userError) {
    return { status: 401, }
  }

  // Update user online status
  await supabase
  .from('users')
  .update({ is_online: true, last_seen: new Date().toISOString() })
  .eq('user_id', credentials['user_id'])

  const encryptedData = encrypt(JSON.stringify(userData.user.user_metadata));
  cookieStore.set('user', encryptedData, {maxAge: 60*60, path: '/'});
  if (userData.user.user_metadata.role === 'admin') {
    redirect('/admin');
  } else if (userData.user.user_metadata.role === 'student') {
    redirect('/user');
  } else {
    return { status: 401, }
  }
  // console.log(userData.user.user_metadata.role);
  // const isPasswordValid = credentials['password_hash'] === user.password_hash;
  // if (isPasswordValid) {
  //   if (user.role === 'admin') {
  //     redirect('/admin');
  //   } else if (user.role === 'student') {
  //     redirect('/user');
  //   } else {
  //     // redirect('/error');
  //   }
  // } else {
  //   // redirect('/error');
  // }
}
