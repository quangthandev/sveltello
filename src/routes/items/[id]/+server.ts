import { error, json } from '@sveltejs/kit';
import { deleteCard, upsertItem } from '../../boards/[id]/db.js';

export async function DELETE({ locals, params }) {
	const id = params.id;

	if (!id) {
		throw error(422, 'ID is required');
	}

	await deleteCard(id, locals.userId);

	return json({ message: 'ok' });
}

export async function PUT({ request, locals, params }) {
	const id = params.id;

	if (!id) {
		throw error(422, 'ID is required');
	}

	const { title, columnId, order, boardId } = await request.json();

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
