import { fail, redirect } from '@sveltejs/kit';
import { login } from './queries.js';

export function load({ cookies }) {
	const userId = cookies.get('auth');

	if (userId) {
		throw redirect(303, '/boards');
	}
}

export const actions = {
	default: async ({ cookies, url, request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString() || '';
		const password = data.get('password')?.toString() || '';

		const errors = await validate(email, password);

		if (errors) {
			return fail(422);
		}

		const userId = await login(email, password);

		if (userId === false) {
			return fail(400, {
				error: 'Invalid Credentials'
			});
		}

		cookies.set('auth', userId, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		const returnURL = url.searchParams.get('returnURL');

		throw redirect(303, returnURL ? returnURL : '/boards');
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
	} else if (password.length < 8) {
		errors.password = 'Password must be at least 8 characters.';
	}

	return Object.keys(errors).length ? errors : null;
}
