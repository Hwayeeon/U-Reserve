import { login } from '@/auth/login';

export async function POST(request) {
  const body = await request.json();
  const response = await login(body);
  if (!response.success) {
    return new Response(JSON.stringify({ success: false, message: response.message }), { status: 401 });
  }
  return new Response(JSON.stringify({ success: true, message: 'Login successful' }), { status: 200 });
}

export async function GET() {
  return new Response(JSON.stringify({ success: false, message: 'Method Not Allowed' }), { status: 405 });
}