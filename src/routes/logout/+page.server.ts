import { dev } from '$app/environment';
import { AUTH_SESSION_COOKIE_NAME } from '$lib/features/auth/auth.constants';
import { invalidateSession } from '$lib/features/auth/auth.services.js';
import { fail, redirect } from '@sveltejs/kit';

export function load() {
	redirect(308, '/');
}

export const actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401);
		}

		await invalidateSession(locals.session.id);
		cookies.delete(AUTH_SESSION_COOKIE_NAME, {
			httpOnly: true,
			path: '.',
			secure: !dev,
			sameSite: 'lax'
		});

		redirect(302, '/');
	}
};
