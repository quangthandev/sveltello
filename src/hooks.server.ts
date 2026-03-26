import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { AUTH_SESSION_COOKIE_NAME } from '$lib/features/auth/auth.constants';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { validateSession } from '$lib/features/auth/auth.services';

Sentry.init({
	dsn: PUBLIC_SENTRY_DSN,
	tracesSampleRate: 1,
	enabled: process.env.NODE_ENV === 'production'
});

const PUBLIC_ROUTES = ['/', '/login', '/signup'];

export const handleError = Sentry.handleErrorWithSentry();

export const handle = sequence(Sentry.sentryHandle(), async function _handle({ event, resolve }) {
	const token = event.cookies.get(AUTH_SESSION_COOKIE_NAME);

	if (!token && !PUBLIC_ROUTES.includes(event.url.pathname)) {
		event.locals.user = null;
		event.locals.session = null;

		redirect(302, `/login?returnURL=${encodeURIComponent(event.url.pathname)}`);
	} else if (token) {
		const { session, sessionExtended, user } = await validateSession(token);

		if (session) {
			if (sessionExtended) {
				event.cookies.set(AUTH_SESSION_COOKIE_NAME, token, {
					httpOnly: true,
					path: '.',
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
					expires: new Date(session.expiresAt)
				});
			}
		} else {
			event.cookies.delete(AUTH_SESSION_COOKIE_NAME, {
				httpOnly: true,
				path: '.',
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax'
			});
		}

		event.locals.user = user;
		event.locals.session = session;
	}

	return await resolve(event);
});
