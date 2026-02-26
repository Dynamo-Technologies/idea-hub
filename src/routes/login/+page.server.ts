import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const DEMO_USERS: Record<string, { password: string; email: string; name: string }> = {
	'admin.one@dynamo.works': { password: 'password', email: 'admin.one@dynamo.works', name: 'Admin One' }
};

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals: { supabase }, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		// Check demo users first
		const demoUser = DEMO_USERS[email.toLowerCase()];
		if (demoUser && demoUser.password === password) {
			const user = {
				id: `demo-${email.replace(/[@.]/g, '-')}`,
				email: demoUser.email,
				user_metadata: { name: demoUser.name },
				app_metadata: {},
				aud: 'authenticated',
				created_at: new Date().toISOString()
			};
			cookies.set('demo_session', JSON.stringify(user), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 // 24 hours
			});
			redirect(303, '/');
		}

		// Try Supabase auth
		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { error: 'Invalid email or password', email });
		}

		redirect(303, '/');
	}
};
