import { lucia } from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(308, '/');
}

export const actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401);
		}

		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		throw redirect(302, '/');
	}
};
