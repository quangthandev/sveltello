import { error, json } from '@sveltejs/kit';
import { checkAuthUser } from '$lib/server/auth';
import { getBoard } from '$lib/features/boards/db-queries';

export async function GET({ params, locals }) {
	if (!params.id) {
		throw error(422, 'Board ID is required');
	}

	checkAuthUser(locals, `/boards/${params.id}`);

	const board = await getBoard(parseInt(params.id), locals.user.id);

	if (!board) {
		throw error(404, 'Board not found');
	}

	return json(board);
}
