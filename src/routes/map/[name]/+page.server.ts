import type { PageServerLoad } from './$types';
import { createHash } from 'crypto';
import { env } from '$env/dynamic/private';

const RAW_DATA = JSON.parse(env.DATA || "[]") as string[];

const DATA = Object.fromEntries(RAW_DATA.map(encoded_entry => {
    return [createHash('sha256').update(Uint8Array.from(atob(encoded_entry), c => c.charCodeAt(0))).digest("hex"), encoded_entry];
}));

export const load: PageServerLoad = async ({ params }) => {
	return {
		data: DATA[params.name]
	};
};