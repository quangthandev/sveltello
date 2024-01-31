import { json } from '@sveltejs/kit';
import { upsertItem } from './queries.js';

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
