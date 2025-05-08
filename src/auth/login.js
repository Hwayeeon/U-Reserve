import studentData from '../data/dummy.json';
import adminData from '../data/dummy2.json';
import { encrypt, encryptRole } from "@/lib/crypt";
import { cookies } from "next/headers";
import { setActiveUser } from "@/lib/session";

export async function login(user) {
  const { NIM, password } = user;
  let data;
  let encryptedRole;
  const d = new Date().getHours();
  if (NIM in studentData || NIM in adminData) {
    if (studentData[NIM]?.password === password) {
      data = studentData[NIM];
      data['NIM'] = NIM;
      encryptedRole = encryptRole('Student', data.email, data.name, true, d);
    } else if (adminData[NIM]?.password === password) {
      data = adminData[NIM];
      data['NIM'] = NIM;
      encryptedRole = encryptRole('Admin', data.email, data.name, true, d);
    } else {
      return {
        success: false,
        message: 'Invalid password',
      };
    }
    const encryptedData = encrypt(JSON.stringify(data));
    const cookieStore = await cookies();
    cookieStore.set('role', encryptedRole, {maxAge: 60*60, path: '/'});
    cookieStore.set('user', encryptedData, {maxAge: 60*60, path: '/'});
    setActiveUser(NIM, JSON.stringify(data));
    return {
      success: true,
      message: 'Login successful',
    };
  } else {
    return {
      success: false,
      message: 'User not found',
    };
  }
}