import { error, json } from '@sveltejs/kit';
import { checkAuthUser } from '$lib/server/auth';
import { deleteItem, getItem } from '$lib/features/items/db-queries';
import { moveItemToColumn, upsertItem } from '$lib/features/boards/db-queries';
import { createItemSchema, moveItemToColumnSchema } from '$lib/features/items/schemas';

export async function GET({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Item not found');
	}

	checkAuthUser(locals, `/items/${params.id}`);

	try {
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
	} catch (err) {
		throw error(500, { message: 'Failed to fetch item' });
	}
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

	const data = await request.json();

	const result = await createItemSchema.safeParseAsync(data);

	if (!result.success) {
		return error(422, {
			message: result.error.message
		});
	}

	const { title, columnId, order, boardId } = result.data;

	await upsertItem(
		{
			id,
			title,
			columnId,
			order: order,
			boardId: boardId
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

	const data = await request.json();

	const result = await moveItemToColumnSchema.safeParseAsync(data);

	if (!result.success) {
		return error(422, {
			message: result.error.message
		});
	}

	const { columnId } = result.data;

	await moveItemToColumn(id, columnId, locals.user.id);

	return json({ message: 'ok' });
}
