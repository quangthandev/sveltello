import { error, json } from '@sveltejs/kit';
import { getBoard, upsertItem } from './db.js';

export async function GET({ params, locals }) {
	if (!params.id) {
		throw error(422, 'Board ID is required');
	}

	const board = await getBoard(Number(params.id), locals.userId);

	if (!board) {
		throw error(404, 'Board not found');
	}

	return json(board);
}

export async function POST({ request, locals, params }) {
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
		locals.userId
	);

	return json({ message: 'ok' });
}
