import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { z } from 'zod';
import { createUser, userExists } from '$lib/features/auth/db-queries';
import { authCredentialsSchema } from '$lib/features/auth/schemas';
import { createSession } from '$lib/features/auth/auth.services.js';
import { AUTH_SESSION_COOKIE_NAME } from '$lib/features/auth/auth.constants.js';

export function load() {
	return { title: 'Sign Up' };
}

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();

		try {
			const { email, password } = await authCredentialsSchema.parseAsync(
				Object.fromEntries(formData)
			);

			if (await userExists(email)) {
				return fail(400, {
					error: 'An account with this email already exists.'
				});
			}

			const user = await createUser(email, password);

			const [session, token] = await createSession(user.id);

			cookies.set(AUTH_SESSION_COOKIE_NAME, token, {
				httpOnly: true,
				path: '.',
				secure: !dev,
				sameSite: 'lax',
				expires: new Date(session.expiresAt)
			});

			redirect(302, '/boards');
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
