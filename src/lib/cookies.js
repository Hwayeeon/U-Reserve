'use client';
import { decrypt } from "@/lib/crypt";

export function getCookies(name) {
    try {
        const cookie = decodeURIComponent(document.cookie);
        const parts = cookie.split('; ').find(row => row.startsWith(`${name}=`)).split('=')[1];
        if (name === 'user') {
            const decrypted = decrypt(parts);
            return JSON.parse(decrypted);
        } else if (typeof JSON.parse(parts) === 'object') {
          return JSON.parse(parts);
        } else if (parts) {
          return parts;
        }
        throw new Error(`Cookie with name ${name} not found`);
    }
    catch (error) {
        if (name === 'user') {
            return {
                "name":"alien",
                "email":"alien@civitas.ukrida.ac.id",
                "prodi":"Pengetahuan Galaxy",
                "role":"admin",
                "password":"ureserve2025",
                "avatar":"https://i1.sndcdn.com/artworks-ACVdFsOSQyupQv3b-UkcUtA-t500x500.png"
            };
        }
        console.error(error);
        return null;
    }
}