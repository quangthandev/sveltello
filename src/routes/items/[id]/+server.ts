import { error, json } from '@sveltejs/kit';
import { deleteCard, upsertItem } from '../../boards/[id]/queries.js';

export async function DELETE({ locals, params }) {
	const id = params.id;

	if (!id) {
		throw error(422, 'ID is required');
	}

	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	await deleteCard(id, locals.user.id);

	return json({ message: 'ok' });
}

export async function PUT({ request, locals, params }) {
	const id = params.id;

	if (!id) {
		throw error(422, 'ID is required');
	}

	if (!locals.user) {
		throw error(401, 'Unauthorized');
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
		locals.user.id
	);

	return json({ message: 'ok' });
}
