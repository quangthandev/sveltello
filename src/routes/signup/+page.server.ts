import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { z } from 'zod';
import { authCredentialsSchema } from '$lib/features/auth/auth.schemas';
import { signup } from '$lib/features/auth/auth.services.js';
import { AUTH_SESSION_COOKIE_NAME } from '$lib/features/auth/auth.constants.js';
import { EmailAlreadyExistsError } from '$lib/errors';

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

			const [session, token] = await signup(email, password);

			cookies.set(AUTH_SESSION_COOKIE_NAME, token, {
				httpOnly: true,
				path: '.',
				secure: !dev,
				sameSite: 'lax',
				expires: new Date(session.expiresAt)
			});

			redirect(302, '/boards');
		} catch (error) {
			if (error instanceof EmailAlreadyExistsError) {
				return fail(400, {
					error: error.message
				});
			}

			if (error instanceof z.ZodError) {
				return fail(400, {
					error: error.errors[0].message
				});
			}

			throw error;
		}
	}
};
