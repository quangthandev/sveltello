import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(308, '/');
}

export const actions = {
	default: async ({ cookies }) => {
		cookies.set('auth', '', { path: '/' });
		throw redirect(308, '/');
	}
};
