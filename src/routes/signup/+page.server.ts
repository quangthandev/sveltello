import { fail, redirect } from '@sveltejs/kit';
import { userExists, createUser } from './queries.js';
import { lucia } from '$lib/server/auth.js';

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString() || '';
		const password = data.get('password')?.toString() || '';

		let errors;

		try {
			errors = await validate(email, password);
		} catch (e) {
			return fail(500, {
				error: 'Something went wrong'
			});
		}

		if (errors) {
			if (errors.email) {
				return fail(400, {
					error: errors.email
				});
			}

			return fail(422);
		}

		const user = await createUser(email, password);

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/boards');
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

	if (!errors.email && (await userExists(email))) {
		errors.email = 'An account with this email already exists.';
	}

	return Object.keys(errors).length ? errors : null;
}
