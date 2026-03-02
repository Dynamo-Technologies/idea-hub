import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	await supabase.auth.signOut();
	return json({ ok: true });
};
