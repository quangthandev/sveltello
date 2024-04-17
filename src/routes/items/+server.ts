import { json } from '@sveltejs/kit';
import { checkAuthUser } from '$lib/server/auth';
import { upsertItem } from '$lib/features/boards/db-queries';
import { createItemSchema } from '$lib/features/items/schemas';

export async function POST({ request, locals }) {
	checkAuthUser(locals);

	const body = await request.json();

	const { id, title, columnId, order, boardId } = createItemSchema.parse(body);

	const data = await upsertItem(
		{
			id,
			title,
			columnId,
			order,
			boardId
		},
		locals.user.id
	);

	return json(data);
}
