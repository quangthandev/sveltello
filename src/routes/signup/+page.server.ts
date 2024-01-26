import { fail, redirect } from '@sveltejs/kit';
import { accountExists, createAccount } from './queries.js';

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString() || '';
		const password = data.get('password')?.toString() || '';

		const errors = await validate(email, password);

		if (errors) {
			if (errors.email) {
				return fail(400, {
					error: errors.email
				});
			}

			return fail(422);
		}

		const user = await createAccount(email, password);

		cookies.set('auth', user.id, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7
		});

		redirect(303, '/boards');
	}
};

async function validate(email: string, password: string) {
	const errors: { email?: string; password?: string } = {};

	if (!email) {
		errors.email = 'Email is required.';
	} else if (!email.includes('@')) {
		errors.email = 'Please enter a valid email address.';
	}

	if (!password) {
		errors.password = 'Password is required.';
	}

	if (!errors.email && (await accountExists(email))) {
		errors.email = 'An account with this email already exists.';
	}

	return Object.keys(errors).length ? errors : null;
}
