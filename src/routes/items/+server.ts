import { json } from '@sveltejs/kit';
import { upsertItem } from '../boards/[id]/db.js';

export async function POST({ request, locals }) {
	const { id, title, columnId, order, boardId } = await request.json();

	const data = await upsertItem(
		{
			id,
			title,
			columnId,
			order: parseInt(order),
			boardId: parseInt(boardId)
		},
		locals.userId
	);

	return json(data);
}
