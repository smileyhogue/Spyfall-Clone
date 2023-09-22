"use server";
import { cookies } from 'next/headers';

async function getCookie() {
    const cookieStore = cookies();
    const cookieName = cookieStore.get('name');
    return cookieName;
}

export default getCookie;