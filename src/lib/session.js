import { writeFileSync, existsSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';

const activeUserFilePath = join(process.cwd(), 'src', 'data', 'activeUser.json');

// Function to write the current active user
export function setActiveUser(NIM, user) {
    const data = JSON.parse(readFileSync(activeUserFilePath, 'utf8'));
    data[NIM] = JSON.parse(user);
    writeFileSync(activeUserFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Function to delete the active user on signout
export function clearActiveUser() {
    if (existsSync(activeUserFilePath)) {
        unlinkSync(activeUserFilePath);
        console.log('Active user cleared.');
    } else {
        console.log('No active user to clear.');
    }
}

export async function deleteActiveUser(username) {
    const data = JSON.parse(readFileSync(activeUserFilePath, 'utf8'));
    if (data[username]) {
        delete data[username];
        writeFileSync(activeUserFilePath, JSON.stringify(data), 'utf8');
        return {
            success: true,
            message: 'Logout successful',
        };
    } else {
        return {
            success: false,
            message: 'User not found',
        };
    }
}

export function getActiveUser() {
    if (existsSync(activeUserFilePath)) {
        const data = JSON.parse(readFileSync(activeUserFilePath, 'utf8'));
        return data;
    } else {
        console.log('No active user found.');
        return null;
    }
}

export function getActiveUserByNIM(NIM) {
    if (existsSync(activeUserFilePath)) {
        const data = JSON.parse(readFileSync(activeUserFilePath, 'utf8'));
        return data[NIM] || null;
    } else {
        console.log('No active user found.');
        return null;
    }
}