import { error, json } from '@sveltejs/kit';
import { checkAuthUser } from '$lib/server/auth';
import { upsertItem } from '$lib/features/boards/db-queries';
import { createItemSchema } from '$lib/features/items/schemas';
import { z } from 'zod';

export async function POST({ request, locals }) {
	checkAuthUser(locals);

	const data = await request.json();

	try {
		const { id, title, columnId, order, boardId } = await createItemSchema.parseAsync(data);

		const newItem = await upsertItem(
			{
				id,
				title,
				columnId,
				order,
				boardId
			},
			locals.user.id
		);

		return json(newItem);
	} catch (err) {
		if (err instanceof z.ZodError) {
			return error(422, {
				message: err.message
			});
		}

		throw err;
	}
}
