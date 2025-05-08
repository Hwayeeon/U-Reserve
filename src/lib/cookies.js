import { decrypt, decryptRole } from "@/lib/crypt";

/*
 * Function to get a cookie in the browser (client-side).
 * @param {string} name - The name of the cookie to be retrieved.
 * @return {string|null} - The value of the cookie if found, otherwise null.
 * Please add more conditions to handle different cookie names that may
   require JSON parsing or decryption.
 */
export function getCookies(name) {
    try {
        const cookie = decodeURIComponent(document.cookie);
        const parts = cookie.split('; ')?.find(row => row.startsWith(`${name}=`))?.split('=')[1];
        if (name === 'user') {
            const decrypted = decrypt(parts);
            return JSON.parse(decrypted);
        } else if (name === 'role') {
            const decryptedUser = getCookies('user');
            const decryptedRole = decryptRole(parts, decryptedUser?.email, decryptedUser?.name);
            return decryptedRole;
        } else if (parts) {
          return parts;
        }
        throw new Error(`Cookie with name ${name} not found`);
    }
    catch (error) {
        console.error(error);
        return null;
    }
}