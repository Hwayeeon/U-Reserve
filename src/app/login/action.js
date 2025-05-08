'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(credentials) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { data:user, error } = await supabase
  .from('users',)
  .select('user_id, password_hash, role')
  .eq('user_id', credentials['user_id'])
  .single(); 

  if (error || !user) {
    redirect('/error');
  }

    const isPasswordValid = credentials['password_hash'] === user.password_hash;
    console.log(isPasswordValid, user, credentials['password_hash'], user.password_hash);
  if (isPasswordValid) {
    if (user.role === 'admin') {
      redirect('/admin');
    } else if (user.role === 'student') {
      redirect('/user');
    } else {
      redirect('/error');
    }
  } else {
    redirect('/error');
  }
}
