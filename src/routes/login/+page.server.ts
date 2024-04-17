import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { lucia } from '$lib/server/auth';
import { login } from '$lib/features/auth/queries';
import { authCredentialsSchema } from '$lib/features/auth/schemas.js';

export function load({ locals }) {
	const user = locals.user;

	if (user) {
		throw redirect(302, '/boards');
	}

	return { title: 'Login' };
}

export const actions = {
	default: async ({ cookies, url, request }) => {
		const formData = await request.formData();

		try {
			const { email, password } = await authCredentialsSchema.parseAsync(
				Object.fromEntries(formData)
			);

			const userId = await login(email, password);

			if (userId === false) {
				return fail(400, {
					error: 'Invalid Credentials'
				});
			}

			const session = await lucia.createSession(userId, {
				created_at: new Date(),
				updated_at: new Date()
			});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			const returnURL = url.searchParams.get('returnURL');

			throw redirect(302, returnURL ? returnURL : '/boards');
		} catch (error) {
			if (error instanceof z.ZodError) {
				return fail(400, {
					error: error.errors[0].message
				});
			}

			throw error;
		}
	}
};
