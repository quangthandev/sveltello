import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies }) => {
		cookies.set('auth', '', { path: '/' });
		throw redirect(308, '/');
	}
};
