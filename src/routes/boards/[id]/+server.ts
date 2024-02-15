import { error, json } from '@sveltejs/kit';
import { getBoard, upsertItem } from './db.js';

export async function GET({ params, locals }) {
	if (!params.id) {
		throw error(422, 'Board ID is required');
	}

	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const board = await getBoard(Number(params.id), locals.user.id);

	if (!board) {
		throw error(404, 'Board not found');
	}

	return json(board);
}

export async function POST({ request, locals, params }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

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
