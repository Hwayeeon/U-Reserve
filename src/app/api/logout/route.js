import { deleteActiveUser } from "@/lib/session";
import { decrypt } from "@/lib/crypt";

export async function POST() {
    return new Response('Method not allowed', { status: 405 });
}

export async function GET(request) {
    const user = JSON.parse(decrypt(request.cookies.get('user')?.value));
    const NIM = user?.email?.match(/(\d+)/)[0];
    const response = await deleteActiveUser(NIM);
    if (!response.success) {
        return new Response(JSON.stringify({ success: false, message: response.message }), { status: 401 });
    }
    return new Response(JSON.stringify({ success: true, message: 'Logout successful' }), { status: 200 });
}