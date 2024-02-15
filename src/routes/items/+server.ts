import { error, json } from '@sveltejs/kit';
import { upsertItem } from '../boards/[id]/queries.js';

export async function POST({ request, locals }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { id, title, columnId, order, boardId } = await request.json();

	const data = await upsertItem(
		{
			id,
			title,
			columnId,
			order: parseInt(order),
			boardId: parseInt(boardId)
		},
		locals.user.id
	);

	return json(data);
}
