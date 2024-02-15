import { redirect } from '@sveltejs/kit';

export function load({ request, locals }) {
	const user = locals.user;

	// Redirect to /boards if user is logged in and tries to access the home page
	if (user && new URL(request.url).pathname === '/') {
		throw redirect(302, '/boards');
	}

	return { user };
}
