import { error, json } from '@sveltejs/kit';
import { checkAuthUser } from '$lib/server/auth';
import { getBoard } from '$lib/features/boards/db-queries';

export async function GET({ params, locals }) {
	if (!params.id) {
		throw error(422, 'Board ID is required');
	}

	checkAuthUser(locals, `/boards/${params.id}`);

	try {
		const board = await getBoard(Number(params.id), locals.user.id);

		if (!board) {
			throw error(404, 'Board not found');
		}

		return json(board);
	} catch (err) {
		throw error(500, { message: 'Failed to fetch board' });
	}
}
