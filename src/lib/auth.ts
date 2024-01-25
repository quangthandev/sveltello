import { redirect, type Cookies } from '@sveltejs/kit';

export function getAuthFromCookies(cookies: Cookies): string | null {
	const userId = cookies.get('auth');
	return userId ?? null;
}
export function requireAuthCookie(cookies: Cookies) {
	const userId = getAuthFromCookies(cookies);

	if (!userId) {
		cookies.set('auth', '', { path: '/' });

		throw redirect(302, '/login');
	}

	return userId;
}
