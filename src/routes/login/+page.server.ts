import { fail, redirect } from '@sveltejs/kit';
import { login } from './queries.js';
import { lucia } from '$lib/server/auth.js';
import { EmailSchema, PasswordSchema } from '../schemas.js';
import { z } from 'zod';

export function load({ locals }) {
	const user = locals.user;

	if (user) {
		throw redirect(302, '/boards');
	}
}

const schema = z.object({
	email: EmailSchema,
	password: PasswordSchema
});

export const actions = {
	default: async ({ cookies, url, request }) => {
		const formData = await request.formData();

		try {
			const { email, password } = await schema.parseAsync(Object.fromEntries(formData));

			const userId = await login(email, password);

			if (userId === false) {
				return fail(400, {
					error: 'Invalid Credentials'
				});
			}

			const session = await lucia.createSession(userId, {});
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
