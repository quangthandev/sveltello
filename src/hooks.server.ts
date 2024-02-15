import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

const PUBLIC_ROUTES = ['/', '/login', '/signup'];

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId && !PUBLIC_ROUTES.includes(event.url.pathname)) {
		event.locals.user = null;
		event.locals.session = null;

		throw redirect(302, `/login?returnURL=${encodeURIComponent(event.url.pathname)}`);
	} else if (sessionId) {
		const { session, user } = await lucia.validateSession(sessionId);

		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		event.locals.user = user;
		event.locals.session = session;
	}

	return await resolve(event);
}
