import { error, json } from '@sveltejs/kit';
import { checkAuthUser } from '$lib/server/auth';
import { deleteItem, getItem } from '$lib/features/items/db-queries';
import { moveItemToColumn, upsertItem } from '$lib/features/boards/db-queries';

export async function GET({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Item not found');
	}

	checkAuthUser(locals, `/items/${params.id}`);

	const item = await getItem(params.id, locals.user.id);

	if (!item) {
		throw error(404, 'Board not found');
	}

	return json({
		...item,
		attachments: (item.attachments ?? []).map((attachment) => ({
			...attachment,
			isCover: item.cover?.attachmentId === attachment.id
		}))
	});
}

export async function DELETE({ locals, params }) {
	const id = params.id;

	if (!id) {
		throw error(422, 'ID is required');
	}

	checkAuthUser(locals, `/items/${params.id}`);

	await deleteItem(id, locals.user.id);

	return json({ message: 'ok' });
}

export async function PUT({ request, locals, params }) {
	const id = params.id;

	if (!id) {
		throw error(422, 'ID is required');
	}

	checkAuthUser(locals, `/items/${params.id}`);

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

export async function PATCH({ request, locals, params }) {
	const id = params.id;

	if (!id) {
		throw error(422, 'ID is required');
	}

	checkAuthUser(locals, `/items/${params.id}`);

	const { columnId } = await request.json();

	await moveItemToColumn(id, columnId, locals.user.id);

	return json({ message: 'ok' });
}
