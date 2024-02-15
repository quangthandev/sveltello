import { error, json } from '@sveltejs/kit';
import { getBoard, upsertItem } from './queries.js';
import { checkAuthUser } from '$lib/server/auth.js';

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

export async function POST({ request, locals, params }) {
	checkAuthUser(locals);

	const boardId = params.id;

	const { id, title, columnId, order } = await request.json();

	await upsertItem(
		{
			id,
			title,
			columnId,
			order: order,
			boardId: parseInt(boardId)
		},
		locals.user.id
	);

	return json({ message: 'ok' });
}
