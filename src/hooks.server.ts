import { redirect } from '@sveltejs/kit';

const PUBLIC_ROUTES = ['/', '/login', '/logout', '/signup'];

export async function handle({ event, resolve }) {
	const userId = event.cookies.get('auth');

	if (!userId && !PUBLIC_ROUTES.includes(event.url.pathname)) {
		event.cookies.set('auth', '', { path: '/' });

		throw redirect(302, `/login?returnURL=${encodeURIComponent(event.url.pathname)}`);
	}

	event.locals.userId = userId ?? '';

	return await resolve(event);
}
