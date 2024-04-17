import { checkAuthUser } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { createColumn } from '$lib/features/boards/queries';
import { insertColumnSchema } from '$lib/features/columns/schemas.js';

export async function POST({ request, locals }) {
	checkAuthUser(locals);

	try {
		const data = await request.json();

		const { id, name, boardId } = await insertColumnSchema.parseAsync(data);

		const column = await createColumn(Number(boardId), name, locals.user.id, id);

		return json(column, { status: 201 });
	} catch (err) {
		if (err instanceof z.ZodError) {
			return json({ errors: err.errors });
		}

		throw err;
	}
}
