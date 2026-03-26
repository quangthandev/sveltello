import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { dev } from '$app/environment';
import { authCredentialsSchema } from '$lib/features/auth/auth.schemas';
import { createSession, login } from '$lib/features/auth/auth.services';
import { AUTH_SESSION_COOKIE_NAME } from '$lib/features/auth/auth.constants';

export function load({ locals }) {
	const user = locals.user;

	if (user) {
		redirect(302, '/boards');
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

			const user = await login(email, password);

			if (user == null) {
				return fail(400, {
					error: 'Invalid Credentials'
				});
			}

			const [session, token] = await createSession(user.id);

			cookies.set(AUTH_SESSION_COOKIE_NAME, token, {
				httpOnly: true,
				path: '.',
				secure: !dev,
				sameSite: 'lax',
				expires: new Date(session.expiresAt)
			});

			const returnURL = url.searchParams.get('returnURL');

			redirect(302, returnURL ? returnURL : '/boards');
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
