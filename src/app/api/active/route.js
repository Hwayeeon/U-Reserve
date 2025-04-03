import { getActiveUser } from '@/lib/session';

export async function POST() {
  return new Response(JSON.stringify({ success: false, message: 'Method Not Allowed' }), { status: 405 });
}

export async function GET(request) {
  try {
    const isLogin = request.cookies.get('user')?.value;
    if (!isLogin) {
      console.log('Unauthorized access attempt');
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }
    const body = await request.json();
    getActiveUser(body);
    return new Response(JSON.stringify({ success: true, message: 'Session set successfully', session }), { status: 200 });
  } catch (error) {
    console.error('Error setting session:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}