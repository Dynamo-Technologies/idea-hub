import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';

const DEMO_USERS: Record<string, { password: string; email: string; name: string }> = {
	'admin.one@dynamo.works': { password: 'password', email: 'admin.one@dynamo.works', name: 'Admin One' }
};

export const handle: Handle = async ({ event, resolve }) => {
	// Check for demo session cookie
	const demoSession = event.cookies.get('demo_session');
	if (demoSession) {
		try {
			const demoUser = JSON.parse(demoSession);
			event.locals.session = { user: demoUser } as any;
			event.locals.user = demoUser;
		} catch {
			event.cookies.delete('demo_session', { path: '/' });
		}
	}

	event.locals.supabase = createServerClient(env.PUBLIC_SUPABASE_URL!, env.PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		// If demo session exists, return it
		if (event.locals.session && event.locals.user) {
			return { session: event.locals.session, user: event.locals.user };
		}

		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	// If no demo session set yet, get from supabase
	if (!event.locals.session) {
		const { session, user } = await event.locals.safeGetSession();
		event.locals.session = session;
		event.locals.user = user;
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
