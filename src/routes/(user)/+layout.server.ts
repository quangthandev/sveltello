import { error } from '@sveltejs/kit';
import { getBoards } from '$lib/features/board/board.repository';
import { checkAuthUser } from '$lib/server/auth/index';

export async function load({ locals }) {
	checkAuthUser(locals, '/boards');

	try {
		const boards = await getBoards(locals.user.id);

		return { boards };
	} catch (err) {
		error(500, { message: 'Failed to fetch boards' });
	}
}
