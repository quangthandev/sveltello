import { redirect } from '@sveltejs/kit';

export function load({ cookies, request }) {
	const userId = cookies.get('auth');

	if (userId && new URL(request.url).pathname === '/') {
		throw redirect(302, '/boards');
	}

	return {
		userId
	};
}
