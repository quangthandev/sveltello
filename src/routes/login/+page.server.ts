import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { dev } from '$app/environment';
import { authCredentialsSchema } from '$lib/features/auth/auth.schemas';
import { login } from '$lib/features/auth/auth.services';
import { AUTH_SESSION_COOKIE_NAME } from '$lib/features/auth/auth.constants';
import { InvalidCredentialsError } from '$lib/errors';

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

			const [session, token] = await login(email, password);

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
			if (error instanceof InvalidCredentialsError) {
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
