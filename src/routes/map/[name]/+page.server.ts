import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const RAW_DATA = JSON.parse(env.DATA || "[]") as string[];

export const load: PageServerLoad = async ({ params }) => {
    for(const encoded_entry of RAW_DATA) {
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", Uint8Array.from(atob(encoded_entry), c => c.charCodeAt(0))))).map((b) => b.toString(16).padStart(2, "0"))
        .join("");
        if(params.name == hash) {
            return {
                data: encoded_entry
            }
        }
    }
};