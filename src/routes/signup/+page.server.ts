import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { z } from 'zod';
import { createUser, userExists } from '$lib/features/auth/db-queries';
import { authCredentialsSchema } from '$lib/features/auth/schemas';

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

			const session = await lucia.createSession(user.id, {
				created_at: new Date(),
				updated_at: new Date()
			});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
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
