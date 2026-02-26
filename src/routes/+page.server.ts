import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		redirect(303, '/login');
	}
};

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		if (!locals.session) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const name = (formData.get('name') as string)?.trim();
		const contract = (formData.get('contract') as string)?.trim();
		const description = (formData.get('description') as string)?.trim();

		const errors: Record<string, string> = {};

		if (!name) errors.name = 'Your name is required';
		if (!contract) errors.contract = 'Contract / Use Case is required';
		if (!description) errors.description = 'Description is required';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, name, contract, description });
		}

		// In a real app, save to Supabase database here
		// await locals.supabase.from('ideas').insert({ name, contract, description, user_id: locals.user?.id });

		return { success: true };
	}
};
