import { json } from '@sveltejs/kit';
import { upsertItem } from '../boards/[id]/queries.js';
import { z } from 'zod';
import { checkAuthUser } from '$lib/server/auth.js';

const itemSchema = z.object({
	id: z.string(),
	title: z.string(),
	columnId: z.string(),
	order: z.string().transform((val) => Number(val)),
	boardId: z.number()
});

export async function POST({ request, locals }) {
	checkAuthUser(locals);

	const body = await request.json();

	const { id, title, columnId, order, boardId } = itemSchema.parse(body);

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
