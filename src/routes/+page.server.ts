import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		redirect(303, '/login');
	}
};

async function createJiraTicket(idea: { name: string; email: string; contract: string; description: string }) {
	const jiraUrl = env.JIRA_URL;
	const jiraEmail = env.JIRA_EMAIL;
	const jiraToken = env.JIRA_API_TOKEN;
	const projectKey = env.JIRA_PROJECT_KEY;

	if (!jiraUrl || !jiraEmail || !jiraToken || !projectKey) {
		console.warn('Jira environment variables not configured, skipping ticket creation');
		return null;
	}

	const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');

	const response = await fetch(`${jiraUrl}/rest/api/3/issue`, {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${auth}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			fields: {
				project: { key: projectKey },
				summary: `[Idea Hub] ${idea.contract} — ${idea.name}`,
				description: {
					type: 'doc',
					version: 1,
					content: [
						{
							type: 'paragraph',
							content: [
								{ type: 'text', text: 'Submitted by: ', marks: [{ type: 'strong' }] },
								{ type: 'text', text: `${idea.name} (${idea.email})` }
							]
						},
						{
							type: 'paragraph',
							content: [
								{ type: 'text', text: 'Contract / Use Case: ', marks: [{ type: 'strong' }] },
								{ type: 'text', text: idea.contract }
							]
						},
						{
							type: 'paragraph',
							content: [
								{ type: 'text', text: 'Description: ', marks: [{ type: 'strong' }] },
								{ type: 'text', text: idea.description }
							]
						}
					]
				},
				issuetype: { name: 'Task' }
			}
		})
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('Jira ticket creation failed:', errorText);
		return null;
	}

	const data = await response.json();
	console.log('Jira ticket created:', data.key);

	// Move ticket to "Ideas" column (transition ID 4)
	await fetch(`${jiraUrl}/rest/api/3/issue/${data.key}/transitions`, {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${auth}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ transition: { id: '4' } })
	});

	return data.key;
}

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		if (!locals.session) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const name = (formData.get('name') as string)?.trim();
		const email = (formData.get('email') as string)?.trim();
		const contract = (formData.get('contract') as string)?.trim();
		const description = (formData.get('description') as string)?.trim();

		const errors: Record<string, string> = {};

		if (!name) errors.name = 'Your name is required';
		if (!email) errors.email = 'Email is required';
		if (!contract) errors.contract = 'Contract / Use Case is required';
		if (!description) errors.description = 'Description is required';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, name, email, contract, description });
		}

		const { data: inserted, error } = await locals.supabase
			.from('ideas')
			.insert({ name, email, contract, description })
			.select();

		if (error) {
			console.error('Supabase insert error:', error);
			return fail(500, { errors: { form: `Failed to submit: ${error.message}` }, name, email, contract, description });
		}

		if (!inserted || inserted.length === 0) {
			console.error('Insert returned no rows — check RLS policies');
			return fail(500, { errors: { form: 'Failed to submit idea. Check database permissions.' }, name, email, contract, description });
		}

		// Create Jira ticket (non-blocking — don't fail the submission if Jira fails)
		const jiraKey = await createJiraTicket({ name, email, contract, description });

		return { success: true, jiraKey };
	}
};
